'use client';

import { useCallback } from 'react';
import { read, utils, writeFile } from 'xlsx';

interface OrderProps {
  products: { id: string; quantity: number }[];
}

const OrderContainer: React.FC<OrderProps> = ({ products }) => {
  /* get state data and export to XLSX */
  const exportFile = useCallback(() => {
    /* generate worksheet from state */
    const ws = utils.json_to_sheet(products);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    /* export to XLSX */
    writeFile(wb, 'product_table.xlsx');
  }, [products]);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <input
        className="mt-5 rounded-md bg-sky-500 px-5 py-3 text-white hover:bg-sky-700"
        type="submit"
        value="Générer le fichier Excel"
        onClick={exportFile}
      />
    </>
  );
};

export default OrderContainer;
