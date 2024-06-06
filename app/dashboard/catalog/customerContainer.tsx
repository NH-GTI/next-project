'use client';

import { Customer } from '@/app/lib/definitions';

interface CustomerContainerProps {
  customers: Customer[];
  selectedCustomerID: string;
  onCustomerChange: (customerID: string) => void;
}

const CustomerContainer: React.FC<CustomerContainerProps> = ({
  customers,
  selectedCustomerID,
  onCustomerChange,
}) => {
  // console.log(customers);

  const handleCustomerChoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCustomerChange(e.target.value);
  };

  return (
    <>
      <select
        name="customer_list"
        id="customer_list"
        value={selectedCustomerID} // Set the selected value
        onChange={handleCustomerChoice}
      >
        <option value="">Select a customer</option> {/* Default option */}
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
