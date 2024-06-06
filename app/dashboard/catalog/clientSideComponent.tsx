'use client';

import { useState } from 'react';
import CustomerContainer from './customerContainer';
import ProductContainer from './productContainer';
import SearchBar from '@/app/ui/dashboard/searchbar';
import Order from './orderContainer';
import { Product, Customer, CustomerProduct } from '@/app/lib/definitions';

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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCustomerID, setSelectedCustomerID] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [productsByCustomer, setProductsByCustomer] =
    useState<Product[]>(initialProducts);

  const handleCustomerChange = (customerID: string) => {
    setSelectedCustomerID(customerID);
    // Filter products based on selected customer
    const filteredProducts = customerProduct
      .filter((item) => item.id_customer === selectedCustomerID)
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
        customers={initialCustomers}
        selectedCustomerID={selectedCustomerID}
        onCustomerChange={handleCustomerChange}
      />
      <SearchBar value={searchTerm} onChange={handleSearch} />
      <ProductContainer products={products} />
    </>
  );
};

export default ClientSideComponent;