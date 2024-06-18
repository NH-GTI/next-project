'use client';

import { useState } from 'react';

export default function Page() {
  const [customerCode, setCustomerCode] = useState('');
  const [orderCode, setOrderCode] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    document.cookie = 'customer-code=' + customerCode + ';path=/dashboard';
    document.cookie = 'order-code=' + orderCode + ';path=/dashboard';
    window.location.href = '/dashboard/catalog';
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="m-auto flex w-2/12 flex-col">
        <label htmlFor="client_code">Code client</label>
        <input
          className="my-5"
          type="text"
          name="client_code"
          id="client_code"
          value={customerCode}
          onChange={(e) => setCustomerCode(e.target.value)}
        />
        <label htmlFor="order_code">Numéro de commande</label>
        <input
          className="my-5"
          type="text"
          name="order_code"
          id="order_code"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
        />
        <input
          className='"mt-5 rounded-md bg-sky-500 px-5 py-3 text-white hover:bg-sky-700'
          type="submit"
          name="submit_client_code"
          id="submit_client_code"
        />
      </form>
    </>
  );
}
