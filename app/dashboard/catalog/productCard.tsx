'use client';

import Image from 'next/image';
import { Product } from '../../lib/definitions';
import { useState, useRef, useEffect } from 'react';

interface ProductProps {
  product: Product;
  sendDataToParent: (product: {
    id: string;
    reference: string;
    quantity: number;
    price: number;
  }) => void;
}

const ProductCard: React.FC<ProductProps> = ({ product, sendDataToParent }) => {
  const [order, setOrder] = useState<
    { id: string; reference: String; quantity: number; price: number }[]
  >([]);
  const [total, setTotal] = useState(0);

  const quantityRef = useRef<HTMLInputElement>(null);

  function handleAddToOrder() {
    if (quantityRef.current) {
      setTotal(0);
      const quantity = parseInt(quantityRef.current.value);

      const productToAdd: {
        id: string;
        reference: string;
        quantity: number;
        price: number;
      } = {
        id: product.id,
        reference: product.reference,
        quantity: quantity,
        price: product.price * quantity,
      };

      sendDataToParent(productToAdd);
    }
  }

  return (
    <div className="w-80 rounded-md p-5 text-left shadow-lg shadow-black/20">
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
            <span className="font-bold">Référence:</span> {product.reference}
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
          id={`product_quantity_${product.id}`}
          step={product.mini}
          min={product.mini}
          defaultValue={product.mini}
          ref={quantityRef}
          onKeyDown={(e) => e.preventDefault()}
        />
        <p>{product.price} €</p>
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

export default ProductCard;
