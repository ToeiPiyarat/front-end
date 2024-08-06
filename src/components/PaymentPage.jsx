import React from 'react';
import { useLocation } from 'react-router-dom';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PaymentPage() {
  const query = useQuery();
  const amount = query.get('amount');
  const currency = query.get('currency');
  const description = query.get('description');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">ชำระเงิน</h1>
        <div className="mb-6">
          <p className="text-lg">จำนวนเงิน: {amount} {currency}</p>
          <p className="text-lg">รายละเอียด: {description}</p>
        </div>
        <button className="w-full btn btn-primary">
          ยืนยันการจ่ายเงิน (จำลอง)
        </button>
      </div>
    </div>
  );
}