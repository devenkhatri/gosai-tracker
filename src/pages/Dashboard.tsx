import React, { useState } from 'react';
import { 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth,
  endOfMonth,
  format
} from 'date-fns';
import { useData } from '../contexts/DataContext';
import FinancialSummary from '../components/FinancialSummary';
import OrderForm from '../components/OrderForm';
import PaymentForm from '../components/PaymentForm';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, TrendingUp, ArrowRight, IndianRupee, ShoppingCart } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { getTotalsByDateRange, orders, payments } = useData();
  const navigate = useNavigate();
  
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const currentMonthStart = startOfMonth(today);
  const currentMonthEnd = endOfMonth(today);
  
  const weekTotals = getTotalsByDateRange(currentWeekStart, currentWeekEnd);
  const monthTotals = getTotalsByDateRange(currentMonthStart, currentMonthEnd);
  
  // Get today's date formatted
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');
  
  // Calculate recent statistics
  const recentOrders = orders.slice(0, 3);
  const recentPayments = payments.slice(0, 3);
  const totalOrdersCount = orders.length;
  const totalPaymentsCount = payments.length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
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
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancialSummary
          orderTotal={weekTotals.orderTotal}
          paymentTotal={weekTotals.paymentTotal}
          dateRange={{ start: currentWeekStart, end: currentWeekEnd }}
          title="This Week"
        />
        <FinancialSummary
          orderTotal={monthTotals.orderTotal}
          paymentTotal={monthTotals.paymentTotal}
          dateRange={{ start: currentMonthStart, end: currentMonthEnd }}
          title="This Month"
        />
      </div>
      
      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/day')}
          className="card p-6 hover:shadow-md transition-shadow text-left flex flex-col h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Day View</h3>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            See all transactions for a specific day in detail.
          </p>
          <div className="text-blue-600 flex items-center text-sm font-medium">
            View Day Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </button>
        
        <button
          onClick={() => navigate('/week')}
          className="card p-6 hover:shadow-md transition-shadow text-left flex flex-col h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Week View</h3>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            Get a weekly overview of all financial activities.
          </p>
          <div className="text-blue-600 flex items-center text-sm font-medium">
            View Week Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </button>
        
        <button
          onClick={() => navigate('/month')}
          className="card p-6 hover:shadow-md transition-shadow text-left flex flex-col h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Month View</h3>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            See the big picture with monthly financial data.
          </p>
          <div className="text-blue-600 flex items-center text-sm font-medium">
            View Month Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </button>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Orders</h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {totalOrdersCount} total
            </span>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center p-3 border border-gray-100 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{order.description}</p>
                      <p className="order-amount">₹{order.amount.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-gray-500">{format(new Date(order.date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent orders</p>
          )}
        </div>
        
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Payments</h3>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {totalPaymentsCount} total
            </span>
          </div>
          
          {recentPayments.length > 0 ? (
            <div className="space-y-3">
              {recentPayments.map(payment => (
                <div key={payment.id} className="flex items-center p-3 border border-gray-100 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <IndianRupee className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{payment.description}</p>
                      <p className="payment-amount">₹{payment.amount.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-gray-500">{format(new Date(payment.date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent payments</p>
          )}
        </div>
      </div>
      
      {/* Forms */}
      {showOrderForm && <OrderForm onClose={() => setShowOrderForm(false)} />}
      {showPaymentForm && <PaymentForm onClose={() => setShowPaymentForm(false)} />}
    </div>
  );
};

export default Dashboard;