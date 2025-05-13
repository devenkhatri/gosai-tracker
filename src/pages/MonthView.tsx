import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth
} from 'date-fns';
import { useData } from '../contexts/DataContext';
import FinancialSummary from '../components/FinancialSummary';
import TransactionList from '../components/TransactionList';
import OrderForm from '../components/OrderForm';
import PaymentForm from '../components/PaymentForm';
import { ChevronLeft, ChevronRight, Plus, ShoppingCart, IndianRupee } from 'lucide-react';

const MonthView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const { getTotalsByDate, getTotalsByDateRange } = useData();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the monthly totals
  const monthTotals = getTotalsByDateRange(monthStart, monthEnd);
  
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  
  // Get day of week names
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Month View</h1>
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
        orderTotal={monthTotals.orderTotal}
        paymentTotal={monthTotals.paymentTotal}
        dateRange={{ start: monthStart, end: monthEnd }}
        title={`Summary for ${format(currentDate, 'MMMM yyyy')}`}
      />
      
      {/* Calendar */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
          <div className="flex space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="calendar-grid mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center font-medium text-sm py-2 text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        <div className="calendar-grid gap-1">
          {daysInMonth.map((day, i) => {
            const dayTotals = getTotalsByDate(day);
            const hasOrders = dayTotals.orderTotal > 0;
            const hasPayments = dayTotals.paymentTotal > 0;
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            // Add empty cells for days before the first day of the month
            if (i === 0) {
              const dayOfWeek = day.getDay();
              const emptyDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
              const emptyCells = Array(emptyDays).fill(null).map((_, index) => (
                <div key={`empty-${index}`} className="p-2 aspect-square"></div>
              ));
              
              return [...emptyCells, 
                <button
                  key={format(day, 'yyyy-MM-dd')}
                  onClick={() => setSelectedDate(day)}
                  className={`p-1 border rounded-lg hover:border-blue-400 transition-colors flex flex-col text-left aspect-square ${
                    isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium">{format(day, 'd')}</span>
                  
                  <div className="mt-auto flex gap-1">
                    {hasOrders && (
                      <div className="h-2 w-2 rounded-full bg-blue-600" title={`Orders: $${dayTotals.orderTotal}`}></div>
                    )}
                    {hasPayments && (
                      <div className="h-2 w-2 rounded-full bg-green-600" title={`Payments: $${dayTotals.paymentTotal}`}></div>
                    )}
                  </div>
                </button>
              ];
            }
            
            return (
              <button
                key={format(day, 'yyyy-MM-dd')}
                onClick={() => setSelectedDate(day)}
                className={`p-1 border rounded-lg hover:border-blue-400 transition-colors flex flex-col text-left aspect-square ${
                  isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <span className="text-sm font-medium">{format(day, 'd')}</span>
                
                <div className="mt-auto flex gap-1">
                  {hasOrders && (
                    <div className="h-2 w-2 rounded-full bg-blue-600" title={`Orders: $${dayTotals.orderTotal}`}></div>
                  )}
                  {hasPayments && (
                    <div className="h-2 w-2 rounded-full bg-green-600" title={`Payments: $${dayTotals.paymentTotal}`}></div>
                  )}
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

export default MonthView;