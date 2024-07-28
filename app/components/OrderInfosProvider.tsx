import { createContext, useContext } from 'react';
import { getCookie } from 'cookies-next';

type OrderInfos = {
  orderID: string;
  customerCode: string;
};

const cookieCustomerCode: string = getCookie('customer-code') as string;
const cookieOrderCode: string = getCookie('order-code') as string;

const defaultOrderInfos: OrderInfos = {
  orderID: cookieOrderCode,
  customerCode: cookieCustomerCode,
};

const OrderInfosContext = createContext<OrderInfos>(defaultOrderInfos);

export const OrderInfosProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <OrderInfosContext.Provider value={defaultOrderInfos}>
      {children}
    </OrderInfosContext.Provider>
  );
};

export const useOrderInfos = () => useContext(OrderInfosContext);
