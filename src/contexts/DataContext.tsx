import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { format } from 'date-fns';
import { useAuth } from './AuthContext';

interface Order {
  id: string;
  date: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface DataContextType {
  orders: Order[];
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Promise<void>;
  getOrdersByDate: (date: Date) => Order[];
  getPaymentsByDate: (date: Date) => Payment[];
  getTotalsByDate: (date: Date) => { orderTotal: number; paymentTotal: number };
  getTotalsByDateRange: (startDate: Date, endDate: Date) => { orderTotal: number; paymentTotal: number };
}

const DataContext = createContext<DataContextType>({
  orders: [],
  payments: [],
  isLoading: false,
  error: null,
  addOrder: async () => {},
  addPayment: async () => {},
  getOrdersByDate: () => [],
  getPaymentsByDate: () => [],
  getTotalsByDate: () => ({ orderTotal: 0, paymentTotal: 0 }),
  getTotalsByDateRange: () => ({ orderTotal: 0, paymentTotal: 0 }),
});

export const useData = () => useContext(DataContext);

interface DataProviderProps {
  children: ReactNode;
}

// Mock API for now - would be replaced with actual Google Sheets API
const mockApi = {
  fetchOrders: (): Promise<Order[]> => {
    return Promise.resolve([
      { id: '1', date: '2025-01-01', amount: 120, description: 'Product A', createdAt: '2025-01-01T12:00:00Z' },
      { id: '2', date: '2025-01-02', amount: 95, description: 'Product B', createdAt: '2025-01-02T14:30:00Z' },
      { id: '3', date: '2025-01-03', amount: 200, description: 'Product C', createdAt: '2025-01-03T09:15:00Z' }
    ]);
  },
  fetchPayments: (): Promise<Payment[]> => {
    return Promise.resolve([
      { id: '1', date: '2025-01-01', amount: 50, description: 'Payment A', createdAt: '2025-01-01T13:00:00Z' },
      { id: '2', date: '2025-01-02', amount: 120, description: 'Payment B', createdAt: '2025-01-02T15:30:00Z' },
      { id: '3', date: '2025-01-04', amount: 75, description: 'Payment C', createdAt: '2025-01-04T10:45:00Z' }
    ]);
  },
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const newOrder = {
      ...order,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    return Promise.resolve(newOrder);
  },
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> => {
    const newPayment = {
      ...payment,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    return Promise.resolve(newPayment);
  }
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would use the Google Sheets API
      const [ordersData, paymentsData] = await Promise.all([
        mockApi.fetchOrders(),
        mockApi.fetchPayments()
      ]);
      
      setOrders(ordersData);
      setPayments(paymentsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const newOrder = await mockApi.addOrder(order);
      setOrders(prevOrders => [...prevOrders, newOrder]);
      return Promise.resolve();
    } catch (err) {
      setError('Failed to add order. Please try again.');
      console.error('Error adding order:', err);
      return Promise.reject(err);
    }
  };

  const addPayment = async (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    try {
      const newPayment = await mockApi.addPayment(payment);
      setPayments(prevPayments => [...prevPayments, newPayment]);
      return Promise.resolve();
    } catch (err) {
      setError('Failed to add payment. Please try again.');
      console.error('Error adding payment:', err);
      return Promise.reject(err);
    }
  };

  const getOrdersByDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return orders.filter(order => order.date === formattedDate);
  };

  const getPaymentsByDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return payments.filter(payment => payment.date === formattedDate);
  };

  const getTotalsByDate = (date: Date) => {
    const dateOrders = getOrdersByDate(date);
    const datePayments = getPaymentsByDate(date);
    
    const orderTotal = dateOrders.reduce((sum, order) => sum + order.amount, 0);
    const paymentTotal = datePayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return { orderTotal, paymentTotal };
  };

  const getTotalsByDateRange = (startDate: Date, endDate: Date) => {
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= endDate;
    });
    
    const filteredPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
    
    const orderTotal = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const paymentTotal = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return { orderTotal, paymentTotal };
  };

  return (
    <DataContext.Provider
      value={{
        orders,
        payments,
        isLoading,
        error,
        addOrder,
        addPayment,
        getOrdersByDate,
        getPaymentsByDate,
        getTotalsByDate,
        getTotalsByDateRange
      }}
    >
      {children}
    </DataContext.Provider>
  );
};