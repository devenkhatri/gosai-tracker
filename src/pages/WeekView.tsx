import React, { useState } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay
} from 'date-fns';
import { useData } from '../contexts/DataContext';
import FinancialSummary from '../components/FinancialSummary';
import TransactionList from '../components/TransactionList';
import OrderForm from '../components/OrderForm';
import PaymentForm from '../components/PaymentForm';
import { ChevronLeft, ChevronRight, ShoppingCart, IndianRupee } from 'lucide-react';

const WeekView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const { getTotalsByDate, getTotalsByDateRange } = useData();
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Get the weekly totals
  const weekTotals = getTotalsByDateRange(weekStart, weekEnd);
  
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Week View</h1>
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
            <IndianRupee className="h-4 w-4 mr-2" />
            New Payment
          </button>
        </div>
      </div>
      
      {/* Summary Card */}
      <FinancialSummary
        orderTotal={weekTotals.orderTotal}
        paymentTotal={weekTotals.paymentTotal}
        dateRange={{ start: weekStart, end: weekEnd }}
        title={`Week of ${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`}
      />
      
      {/* Week View */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={prevWeek}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextWeek}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {daysInWeek.map(day => {
            const dayTotals = getTotalsByDate(day);
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <button
                key={format(day, 'yyyy-MM-dd')}
                onClick={() => setSelectedDate(day)}
                className={`p-4 border rounded-lg hover:border-blue-400 transition-colors ${
                  isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-center mb-2">
                  <p className="text-sm text-gray-600">{format(day, 'EEE')}</p>
                  <p className="text-xl font-medium">{format(day, 'd')}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Orders:</span>
                    <span className="order-amount">₹{dayTotals.orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payments:</span>
                    <span className="payment-amount">₹{dayTotals.paymentTotal.toFixed(2)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Selected Day Transactions */}
      <TransactionList date={selectedDate} />
      
      {/* Forms */}
      {showOrderForm && <OrderForm onClose={() => setShowOrderForm(false)} date={selectedDate} />}
      {showPaymentForm && <PaymentForm onClose={() => setShowPaymentForm(false)} date={selectedDate} />}
    </div>
  );
};

export default WeekView;