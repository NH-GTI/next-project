'use client';

import { useState, useEffect } from 'react';
import CustomerContainer from './customerContainer';
import ProductContainer from './productContainer';
import SearchBar from '@/app/ui/dashboard/searchbar';
import { Customer, Product } from '@/app/lib/definitions';
import { OrderInfosProvider } from '@/app/components/OrderInfosProvider';

interface ClientSideComponentProps {
  initialProducts: Product[];
  customer: Customer;
}

const ClientSideComponent: React.FC<ClientSideComponentProps> = ({
  initialProducts,
  customer,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTermDes, setSearchTermDes] = useState<string>('');
  const [searchTermRef, setSearchTermRef] = useState<string>('');
  const [searchTermGencod, setSearchTermGencod] = useState<string>('');

  useEffect(() => {
    let filteredProducts = initialProducts;

    if (searchTermDes) {
      filteredProducts = filteredProducts.filter((product) =>
        product.designation.toLowerCase().includes(searchTermDes.toLowerCase()),
      );
    }

    if (searchTermRef) {
      filteredProducts = filteredProducts.filter((product) =>
        product.reference.toLowerCase().includes(searchTermRef.toLowerCase()),
      );
    }

    if (searchTermGencod) {
      filteredProducts = filteredProducts.filter((product) =>
        product.gencod.toLowerCase().includes(searchTermGencod.toLowerCase()),
      );
    }

    setProducts(filteredProducts);
  }, [searchTermDes, searchTermRef, searchTermGencod, initialProducts]);

  const handleSearch = (value: string, searchType: string) => {
    switch (searchType) {
      case 'des':
        setSearchTermDes(value);
        break;
      case 'ref':
        setSearchTermRef(value);
        break;
      case 'gencod':
        setSearchTermGencod(value);
        break;
      default:
        break;
    }
  };
  // console.log('clientSideComponent', products);

  return (
    <>
      <OrderInfosProvider>
        <CustomerContainer customer={customer} />
        <SearchBar
          searchTermDes={searchTermDes}
          searchTermRef={searchTermRef}
          searchTermGencod={searchTermGencod}
          onChange={handleSearch}
        />
        <ProductContainer products={products} />
      </OrderInfosProvider>
    </>
  );
};

export default ClientSideComponent;
