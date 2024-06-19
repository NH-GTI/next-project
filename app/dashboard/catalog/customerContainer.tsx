'use client';

import { useOrderInfos } from '@/app/components/OrderInfosProvider';
import { Customer } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';

interface CustomerContainerComponentProps {
  customer: Customer;
}

const CustomerContainer: React.FC<CustomerContainerComponentProps> = (
  customer,
) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <h1 className="text-xl">
        <span key={customer.customer.id}>
          {isClient
            ? customer.customer.name + ' ' + customer.customer.code
            : 'Pas de client'}
        </span>
      </h1>
    </div>
  );
};

export default CustomerContainer;
