'use client';

import Image from 'next/image';
import { Product } from '../../lib/definitions';
import { useState } from 'react';

interface ProductProps {
  product: Product;
}

const ProductComponent: React.FC<ProductProps> = ({ product }) => {
  const [order, setOrder] = useState({});
  function handleAddToOrder() {}

  return (
    <div className="rounded-md p-5 text-left shadow-lg shadow-black/20 ">
      <div>
        <Image
          src="/products/default_image.jpg"
          width={150}
          height={200}
          alt="Product image"
          className="m-auto"
        />
        <h3>{product.designation}</h3>
      </div>
      <div>
        <ul>
          <li>
            <span className="font-bold">Famille:</span> {product.family}
          </li>
          <li>
            <span className="font-bold">Marque:</span> {product.brand}
          </li>
          <li>
            <span className="font-bold">PCB:</span> {product.pcb}
          </li>
          <li>
            <span className="font-bold">Mini:</span> {product.mini}
          </li>
          <li>
            <span className="font-bold">GENCOD:</span> {product.gencod}
          </li>
        </ul>
      </div>
      <div className="text-center">
        <input
          type="number"
          className="appearance-auto w-50"
          name="product_quantity"
          id="product_quantity"
          step={product.mini}
          min={0}
          defaultValue={product.mini}
        />
        <button
          type="submit"
          className="mt-5 rounded-md bg-sky-500 px-5 py-3 text-white hover:bg-sky-700"
          onClick={handleAddToOrder}
        >
          Ajouter à la commande
        </button>
      </div>
    </div>
  );
};

export default ProductComponent;
