'use client';

import { useOrderInfos } from '@/app/components/OrderInfosProvider';
import { useCallback, useEffect, useState } from 'react';
import { read, utils, writeFile } from 'xlsx';

interface OrderProps {
  products: {
    id: string;
    designation: string;
    reference: string;
    quantity: number;
    price: number;
  }[];
  onDelete: (reference: string) => void;
  totalQuantity: number;
  totalPrice: number;
}

const OrderContainer: React.FC<OrderProps> = ({
  products,
  onDelete,
  totalQuantity,
  totalPrice,
}) => {
  const orderInfos = useOrderInfos();
  const [isTableBodyVisible, setIsTableBodyVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fullProducts = products.map((product) => ({
    customerCode: orderInfos.customerCode,
    ...product,
    orderID: orderInfos.orderID,
    sellType: 'PE',
    discount: 0,
  }));

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  /* get state data and export to XLSX */
  const exportFile = useCallback(() => {
    /* generate worksheet from state */
    const ws = utils.json_to_sheet(fullProducts);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    /* export to XLSX */
    writeFile(wb, 'product_table.xlsx');

    handleSubmitOrder();
  }, [fullProducts]);

  const toggleTableBodyVisibility = () => {
    setIsTableBodyVisible((prev) => !prev);
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: fullProducts,
          orderCode: orderInfos.orderID,
          customerID: orderInfos.customerCode,
          userID: '410544b2-4001-4271-9855-fec4b6a6442a', // replace with actual user ID if available
          state: 1, // replace with actual state if applicable
          totalDiscount: 0, // calculate actual discount if applicable
          totalPrice: fullProducts.reduce(
            (total, product) => total + product.price,
            0,
          ),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="my-12">
        <div className="mb-10 flex flex-row justify-end">
          <p className="mr-8">
            <span className="font-semibold">N° de commande: </span>{' '}
            {isClient ? orderInfos.orderID : ' '}
          </p>
          <p className="mx-8">
            <span className="font-semibold">Quantité totale:</span>{' '}
            {totalQuantity}
          </p>
          <p className="mx-8">
            <span className="font-semibold">Prix total:</span> {totalPrice} €
          </p>
          <button
            onClick={toggleTableBodyVisibility}
            className="mb-4 rounded-md bg-sky-500 px-5 py-3 text-white hover:bg-sky-700"
          >
            {isTableBodyVisible ? 'Masquer le détail' : 'Montrer le détail'}
          </button>
        </div>
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr>
              <th
                className="border-b p-4 pb-3 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                Désignation
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
              <th
                className="border-b p-4 pb-3 pr-8 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                Actions
              </th>
            </tr>
          </thead>
          {isTableBodyVisible && (
            <tbody
              className={`bg-white transition-opacity duration-500 dark:bg-slate-800 ${
                isTableBodyVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {products.map((order) => (
                <tr key={order.reference}>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {order.designation}
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
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <button
                      onClick={() => onDelete(order.reference)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="flex justify-end">
        <input
          className="rounded-md bg-sky-500 px-5 py-3 text-white hover:bg-sky-700"
          type="submit"
          value="Générer le fichier Excel"
          onClick={exportFile}
        />
      </div>
    </>
  );
};

export default OrderContainer;
