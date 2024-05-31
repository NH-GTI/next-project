'use client';

import { Customer } from '@/app/lib/definitions';
import { useState, useEffect } from 'react';

interface CustomerContainerProps {
  customers: Customer[];
}

const CustomerContainer: React.FC<CustomerContainerProps> = ({ customers }) => {
  const [customerID, setCustomerID] = useState<string>('');

  // Load customerID from localStorage when the component mounts
  useEffect(() => {
    const storedCustomerID = localStorage.getItem('customerID');
    if (storedCustomerID) {
      setCustomerID(storedCustomerID);
    }
  }, []);

  // Save customerID to localStorage whenever it changes
  useEffect(() => {
    if (customerID) {
      localStorage.setItem('customerID', customerID);
    }
  }, [customerID]);

  const handleCustomerChoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomerID(e.target.value);
    location.reload();
  };

  return (
    <>
      <select
        name="customer_list"
        id="customer_list"
        value={customerID}
        onChange={handleCustomerChoice}
      >
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default CustomerContainer;
