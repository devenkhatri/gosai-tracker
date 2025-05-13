import React from 'react';
import { format } from 'date-fns';
import { ShoppingCart, IndianRupee } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface TransactionListProps {
  date: Date;
}

const TransactionList: React.FC<TransactionListProps> = ({ date }) => {
  const { getOrdersByDate, getPaymentsByDate } = useData();
  
  const orders = getOrdersByDate(date);
  const payments = getPaymentsByDate(date);
  
  // Combine and sort transactions by time
  const transactions = [
    ...orders.map(order => ({ ...order, type: 'order' })),
    ...payments.map(payment => ({ ...payment, type: 'payment' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (transactions.length === 0) {
    return (
      <div className="card bg-gray-50 p-6 text-center">
        <p className="text-gray-500">No transactions for {format(date, 'MMMM d, yyyy')}</p>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4">Transactions for {format(date, 'MMMM d, yyyy')}</h3>
      <div className="space-y-3">
        {transactions.map(transaction => (
          <div 
            key={`${transaction.type}-${transaction.id}`}
            className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {transaction.type === 'order' ? (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium">{transaction.description}</p>
                <p className={transaction.type === 'order' ? 'order-amount' : 'payment-amount'}>
                  ₹{transaction.amount.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {format(new Date(transaction.createdAt), 'h:mm a')} • {transaction.type === 'order' ? 'Order' : 'Payment'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;