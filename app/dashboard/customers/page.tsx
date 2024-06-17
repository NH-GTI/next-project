'use client';

import { useState } from 'react';

export default function Page() {
  const [customerCode, setCustomerCode] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    document.cookie = 'customer-code=' + customerCode + ';path=/dashboard';
    window.location.href = '/dashboard/catalog';
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="client_code"
          id="client_code"
          value={customerCode}
          onChange={(e) => setCustomerCode(e.target.value)}
        />
        <input
          type="submit"
          name="submit_client_code"
          id="submit_client_code"
        />
      </form>
    </>
  );
}
