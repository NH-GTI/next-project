'use client';

import { useCustomer } from '@/app/components/OrderInfosProvider';
import { Customer } from '@/app/lib/definitions';

const CustomerContainer: React.FC = () => {
  const customerCode = useCustomer();
  console.log(
    'Customer Code From customerContainer',
    customerCode.customerCode,
  );

  return (
    <div>
      <h1 className="text-xl">
        <span key={customerCode.customerCode}></span>
      </h1>
    </div>
  );
};

export default CustomerContainer;
