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
    {
      id: string;
      designation: string;
      reference: string;
      quantity: number;
      price: number;
    }[]
  >([]);

  const handleOrderProduct = (productToAdd: {
    id: string;
    designation: string;
    reference: string;
    quantity: number;
    price: number;
  }) => {
    setOrderProduct((prevData) => {
      const existingProductIndex = prevData.findIndex(
        (p) => p.reference === productToAdd.reference,
      );

      if (existingProductIndex >= 0) {
        // If the product exists, update its quantity
        const updatedProducts = prevData.map((item, index) => {
          if (index === existingProductIndex) {
            return {
              ...item,
              quantity: item.quantity + productToAdd.quantity,
              price: parseFloat((item.price + productToAdd.price).toFixed(2)),
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

  const handleDeleteProduct = (reference: string) => {
    setOrderProduct((prevData) =>
      prevData.filter((product) => product.reference !== reference),
    );
  };

  const totalQuantity = orderProduct.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  const totalPrice = parseFloat(
    orderProduct
      .reduce((total, product) => total + product.price, 0)
      .toFixed(2),
  );

  return (
    <>
      <OrderContainer
        products={orderProduct}
        onDelete={handleDeleteProduct}
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
      />
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
