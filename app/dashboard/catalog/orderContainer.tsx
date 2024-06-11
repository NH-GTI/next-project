'use client';

import { useCallback, useState } from 'react';
import { read, utils, writeFile } from 'xlsx';

interface OrderProps {
  products: {
    id: string;
    reference: string;
    quantity: number;
    price: number;
  }[];
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
      <div className="my-12">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr>
              <th
                className="border-b p-4 pb-3 pl-8 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                ID produit
              </th>
              <th
                className="border-b p-4 pb-3 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                Référence
              </th>
              <th
                className="border-b p-4 pb-3 pr-8 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                Quantité
              </th>
              <th
                className="border-b p-4 pb-3 pr-8 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800">
            {products.map((order) => (
              <tr key={order.id}>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {order.id}
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {order.reference}
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {order.quantity}
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {order.price} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
