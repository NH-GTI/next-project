import { fetchOrders } from '@/app/lib/data';

export default async function Page() {
  const orders = await fetchOrders();
  console.log('Order page : ', orders);

  return (
    <>
      <div>
        <h1 className="mb-10 mt-5 text-2xl">Mes commandes</h1>
      </div>
      <div>
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr>
              <th
                className="border-b p-4 pb-3 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                Référence
              </th>
              <th
                className="border-b p-4 pb-3 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                Client
              </th>
              <th
                className="border-b p-4 pb-3 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                Montant total
              </th>
              <th
                className="border-b p-4 pb-3 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                scope="col"
              >
                Date de création
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800">
            {orders.map((order) => (
              <tr key={order.reference}>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {order.reference}
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {order.id_customer}
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {order.total_price} €
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
