'use client';

import { createContext, useContext } from 'react';
import { getCookie } from 'cookies-next';

type OrderInfos = {
  orderID: string;
  customerCode: string;
};

const cookieCustomerCode: string = getCookie('customer-code') as string;

const defaultOrderInfos: OrderInfos = {
  orderID: '000000',
  customerCode: cookieCustomerCode,
};

const CustomerContext = createContext<OrderInfos>(defaultOrderInfos);

export const CustomerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CustomerContext.Provider value={defaultOrderInfos}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);
