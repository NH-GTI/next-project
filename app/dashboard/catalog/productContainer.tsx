'use client';

import { Product, CustomerProduct } from '@/app/lib/definitions';
import ProductCard from './productCard';
import { useState } from 'react';
import Order from './orderContainer';

interface ProductContainerProps {
  products: Product[];
  customerProduct: CustomerProduct[];
}

const ProductContainer: React.FC<ProductContainerProps> = ({
  products,
  customerProduct,
}) => {
  // if (typeof window !== 'undefined') {
  const storedCustomerID = localStorage.getItem('customerID');
  console.log(storedCustomerID);

  const filteredCustomerProduct = customerProduct.filter(
    (cProduct) => cProduct.id_customer === storedCustomerID,
  );
  // console.log(filteredCustomerProduct);

  const filteredProducts: Product[] = products.filter((product: Product) => {
    return filteredCustomerProduct.some((cProduct: CustomerProduct) => {
      return cProduct.id_product === product.id;
    });
  });

  console.log(filteredProducts);
  // }

  const [orderProduct, setOrderProduct] = useState<
    { id: string; quantity: number }[]
  >([]);

  const handleOrderProduct = (productToAdd: {
    id: string;
    quantity: number;
  }) => {
    setOrderProduct((prevData) => {
      const existingProductIndex = prevData.findIndex(
        (p) => p.id === productToAdd.id,
      );

      if (existingProductIndex >= 0) {
        // If the product exists, update its quantity
        const updatedProducts = prevData.map((item, index) => {
          if (index === existingProductIndex) {
            return { ...item, quantity: item.quantity + productToAdd.quantity };
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
      <Order products={orderProduct} />
      <div className="flex flex-row flex-wrap justify-around gap-10">
        {filteredProducts.map((product) => (
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
