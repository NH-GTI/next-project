'use client';

import { Product } from '@/app/lib/definitions';
import ProductCard from './productCard';
import { useState } from 'react';
import OrderContainer from './orderContainer';

interface ProductContainerProps {
  products: Product[];
}

const ProductContainer: React.FC<ProductContainerProps> = ({ products }) => {
  const [orderProduct, setOrderProduct] = useState<
    { id: string; reference: string; quantity: number; price: number }[]
  >([]);

  const handleOrderProduct = (productToAdd: {
    id: string;
    reference: string;
    quantity: number;
    price: number;
  }) => {
    setOrderProduct((prevData) => {
      const existingProductIndex = prevData.findIndex(
        (p) => p.id === productToAdd.id,
      );

      if (existingProductIndex >= 0) {
        // If the product exists, update its quantity
        const updatedProducts = prevData.map((item, index) => {
          if (index === existingProductIndex) {
            return {
              ...item,
              quantity: item.quantity + productToAdd.quantity,
              price: item.price + productToAdd.price,
            };
          }
          return item;
        });

        return updatedProducts;
      } else {
        // If the product doesn't exist, add it to the array
        return [...prevData, productToAdd];
      }
    });
  };

  return (
    <>
      <OrderContainer products={orderProduct} />
      <div className="flex flex-row flex-wrap justify-around">
        {products.map((product) => (
          <ProductCard
            sendDataToParent={handleOrderProduct}
            product={product}
            key={product.id}
          />
        ))}
      </div>
    </>
  );
};

export default ProductContainer;
