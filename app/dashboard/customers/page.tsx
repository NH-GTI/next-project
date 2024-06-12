'use client';

import { useState } from 'react';

export default function Page() {
  const [customerCode, setCustomerCode] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/customer/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerCode }),
    });
    console.log(JSON.stringify({ customerCode }));

    if (response.ok) {
      // Handle success, maybe redirect to another page
      alert('Client code saved successfully');
    } else {
      // Handle error
      alert('Failed to save client code');
    }
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
