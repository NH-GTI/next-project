'use client';

import { useState } from 'react';
import CustomerContainer from './customerContainer';
import ProductContainer from './productContainer';
import SearchBar from '@/app/ui/dashboard/searchbar';
import { Product, Customer, CustomerProduct } from '@/app/lib/definitions';
import { getCookie } from 'cookies-next';

interface ClientSideComponentProps {
  initialProducts: Product[];
  initialCustomers: Customer[];
  customerProduct: CustomerProduct[];
}

const ClientSideComponent: React.FC<ClientSideComponentProps> = ({
  initialProducts,
  initialCustomers,
  customerProduct,
}) => {
  const customerCode: string = getCookie('customer-code') as string;
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCustomerID, setSelectedCustomerID] =
    useState<string>(customerCode);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [productsByCustomer, setProductsByCustomer] =
    useState<Product[]>(initialProducts);

  const selectedCustomer = initialCustomers.filter(
    (item) => item.code === selectedCustomerID,
  );
  console.log(selectedCustomer);

  const handleCustomerChange = (customerID: string) => {
    setSelectedCustomerID(customerID);
    // Filter products based on selected customer
    const filteredProducts = customerProduct
      .filter((item) => item.customer_code === selectedCustomerID)
      .map((item) => item.id_product);

    const productList = initialProducts.filter((item) =>
      filteredProducts.includes(item.id),
    );
    setProducts(productList);
    setProductsByCustomer(productList);
  };

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
      <CustomerContainer
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleCustomerChange}
      />
      <SearchBar value={searchTerm} onChange={handleSearch} />
      <ProductContainer products={products} />
    </>
  );
};

export default ClientSideComponent;
