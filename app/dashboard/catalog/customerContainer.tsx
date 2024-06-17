'use client';

import { Customer } from '@/app/lib/definitions';

interface CustomerContainerProps {
  selectedCustomer: Customer[];
  onCustomerChange: (customerID: string) => void;
}

const CustomerContainer: React.FC<CustomerContainerProps> = ({
  selectedCustomer,
  onCustomerChange,
}) => {
  const handleCustomerChoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCustomerChange(e.target.value);
  };

  return (
    <div>
      <h1 className="text-xl">
        <span key={selectedCustomer[0].id}>{selectedCustomer[0].name}</span>
      </h1>
    </div>
  );
};

export default CustomerContainer;
