import React from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';

interface FinancialSummaryProps {
  orderTotal: number;
  paymentTotal: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  title?: string;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ 
  orderTotal, 
  paymentTotal, 
  dateRange,
  title = 'Financial Summary'
}) => {
  const balance = paymentTotal - orderTotal;
  const isPositive = balance >= 0;

  // Format date range for display
  const dateRangeText = dateRange 
    ? `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`
    : '';

  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {dateRangeText && (
          <span className="text-sm text-gray-600">{dateRangeText}</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Orders</span>
            <IndianRupee className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold order-amount mt-2">
            ₹{orderTotal.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Payments</span>
            <IndianRupee className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold payment-amount mt-2">
            ₹{paymentTotal.toFixed(2)}
          </p>
        </div>
        
        <div className={`${isPositive ? 'bg-green-50' : 'bg-red-50'} rounded-lg p-4`}>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Balance</span>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-semibold mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            ₹{Math.abs(balance).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;