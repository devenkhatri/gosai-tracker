import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { useData } from '../contexts/DataContext';
import FinancialSummary from '../components/FinancialSummary';
import TransactionList from '../components/TransactionList';
import OrderForm from '../components/OrderForm';
import PaymentForm from '../components/PaymentForm';
import { ChevronLeft, ChevronRight, Calendar, ShoppingCart, DollarSign } from 'lucide-react';

const DayView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const { getTotalsByDate } = useData();
  
  const dayTotals = getTotalsByDate(currentDate);
  
  const prevDay = () => setCurrentDate(subDays(currentDate, 1));
  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Day View</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowOrderForm(true)}
            className="btn btn-primary flex items-center"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            New Order
          </button>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="btn btn-success flex items-center"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            New Payment
          </button>
        </div>
      </div>
      
      {/* Day Navigation */}
      <div className="card">
        <div className="flex items-center justify-between">
          <button
            onClick={prevDay}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
            <button
              onClick={goToToday}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              Today
            </button>
          </div>
          
          <button
            onClick={nextDay}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Summary Card */}
      <FinancialSummary
        orderTotal={dayTotals.orderTotal}
        paymentTotal={dayTotals.paymentTotal}
        title={`Summary for ${format(currentDate, 'MMMM d, yyyy')}`}
      />
      
      {/* Day's Transactions */}
      <TransactionList date={currentDate} />
      
      {/* Forms */}
      {showOrderForm && <OrderForm onClose={() => setShowOrderForm(false)} date={currentDate} />}
      {showPaymentForm && <PaymentForm onClose={() => setShowPaymentForm(false)} date={currentDate} />}
    </div>
  );
};

export default DayView;