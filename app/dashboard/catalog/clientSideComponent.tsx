'use client';

import { useState } from 'react';
import CustomerContainer from './customerContainer';
import ProductContainer from './productContainer';
import SearchBar from '@/app/ui/dashboard/searchbar';
import { Product, Customer } from '@/app/lib/definitions';
import { getCookie } from 'cookies-next';
import { CustomerProvider } from '@/app/components/OrderInfosProvider';

interface ClientSideComponentProps {
  initialProducts: Product[];
}

// const cookieCustomerCode: string = getCookie('customer-code') as string;

const ClientSideComponent: React.FC<ClientSideComponentProps> = ({
  initialProducts,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [productsByCustomer, setProductsByCustomer] =
    useState<Product[]>(initialProducts);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Filter products based on search term
    const filteredProducts = productsByCustomer.filter((product) =>
      product.reference.toLowerCase().includes(value.toLowerCase()),
    );
    setProducts(filteredProducts);
  };

  return (
    <>
      <CustomerProvider>
        <CustomerContainer />
        <SearchBar value={searchTerm} onChange={handleSearch} />
        <ProductContainer products={products} />
      </CustomerProvider>
    </>
  );
};

export default ClientSideComponent;
