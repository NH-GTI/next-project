'use client';

import { Product } from '@/app/lib/definitions';
import ProductCard from './productCard';
import { useState } from 'react';

interface ProductContainerProps {
  products: Product[];
}

const ProductContainer: React.FC<ProductContainerProps> = ({ products }) => {
  const [orderProduct, setOrderProduct] = useState<
    { id: string; quantity: number }[]
  >([]);

  const handleOrderProduct = (
    productToAdd: {
      id: string;
      quantity: number;
    }[],
  ) => {
    setOrderProduct((prevData) => {
      const updatedData = [...prevData];

      orderProduct.forEach((newProduct) => {
        const existingProductIndex = updatedData.findIndex(
          (item) => item.id === newProduct.id,
        );

        if (existingProductIndex >= 0) {
          updatedData[existingProductIndex] = {
            ...updatedData[existingProductIndex],
            quantity:
              updatedData[existingProductIndex].quantity + newProduct.quantity,
          };
        } else {
          updatedData.push(newProduct);
        }
      });

      return updatedData;
    });
  };

  console.log(orderProduct);

  return (
    <>
      {products.map((product) => (
        <ProductCard
          sendDataToParent={handleOrderProduct}
          product={product}
          key={product.id}
        />
      ))}
    </>
  );
};

export default ProductContainer;
