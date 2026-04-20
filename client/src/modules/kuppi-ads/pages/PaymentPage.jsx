import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { kuppiAdService } from '../services/kuppiAdApi';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { classId } = useParams();
  const ad = location.state?.ad;

  const [loading, setLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const paymentAmount = useMemo(() => Number(ad?.price || 0), [ad?.price]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!paymentForm.cardholderName.trim()) {
      toast.error('Cardholder name is required');
      return false;
    }

    if (paymentForm.cardNumber.replace(/\s/g, '').length < 12) {
      toast.error('Enter a valid card number');
      return false;
    }

    if (!paymentForm.expiryDate.trim()) {
      toast.error('Expiry date is required');
      return false;
    }

    if (paymentForm.cvv.trim().length < 3) {
      toast.error('Enter a valid CVV');
      return false;
    }

    return true;
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!ad) {
      toast.error('Class details not found. Please try again from the Kuppi page.');
      navigate('/kuppi');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Prepare payment details (in real app, this would contain actual payment info)
      const paymentDetails = {
        cardholderName: paymentForm.cardholderName,
        cardNumber: paymentForm.cardNumber.replace(/\s/g, ''),
        expiryDate: paymentForm.expiryDate,
        cvv: paymentForm.cvv,
        amount: paymentAmount
      };
      
      // Process payment and enroll the student
      const result = await kuppiAdService.processPaymentAndEnroll(classId, paymentDetails);
      toast.success('Payment successful and enrollment completed!');
      navigate('/kuppi');
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!ad) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-[#1A1C22] border border-[#2A2D36] rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-3">Payment details unavailable</h1>
          <p className="text-[#A0A3BD] mb-6">Please go back and start enrollment from the class card.</p>
          <Link
            to="/kuppi"
            className="inline-flex items-center px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#E86A00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Kuppi Ads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Kuppi Class Payment</h1>
          <p className="text-[#A0A3BD] mt-2">Complete payment to confirm your enrollment.</p>
        </div>
        <Link
          to="/kuppi"
          className="inline-flex items-center px-4 py-2 border border-[#2A2D36] text-black rounded-lg hover:border-[#FF7A00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-[#1A1C22] border border-[#2A2D36] rounded-xl p-6">
          <div className="flex items-center mb-6">
            <CreditCard className="w-6 h-6 text-[#FF7A00] mr-3" />
            <h2 className="text-xl font-semibold text-white">Payment Details</h2>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                value={paymentForm.cardholderName}
                onChange={handleChange}
                placeholder="Name on card"
                className="w-full px-4 py-3 bg-[#111217] border border-[#2A2D36] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentForm.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-[#111217] border border-[#2A2D36] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentForm.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-[#111217] border border-[#2A2D36] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={paymentForm.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full px-4 py-3 bg-[#111217] border border-[#2A2D36] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? 'Processing Payment...' : `Pay Rs. ${paymentAmount}`}
            </button>

            <div className="flex items-center justify-center text-sm text-[#A0A3BD] pt-2">
              <Lock className="w-4 h-4 mr-2 text-[#22C55E]" />
              Secure payment simulation for enrollment confirmation
            </div>
          </form>
        </div>

        <div className="bg-[#1A1C22] border border-[#2A2D36] rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold text-white mb-4">Enrollment Summary</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-[#A0A3BD]">Class</p>
              <p className="text-white font-medium">{ad.title}</p>
            </div>
            <div>
              <p className="text-[#A0A3BD]">Tutor</p>
              <p className="text-white font-medium">{ad.tutorName}</p>
            </div>
            <div>
              <p className="text-[#A0A3BD]">Subject</p>
              <p className="text-white font-medium">{ad.subject}</p>
            </div>
            <div>
              <p className="text-[#A0A3BD]">Location</p>
              <p className="text-white font-medium">{ad.location}</p>
            </div>
            <div>
              <p className="text-[#A0A3BD]">Date & Time</p>
              <p className="text-white font-medium">{new Date(ad.date).toLocaleDateString()} at {ad.time}</p>
            </div>
            <div className="pt-4 border-t border-[#2A2D36]">
              <div className="flex items-center justify-between">
                <span className="text-[#A0A3BD]">Class Fee</span>
                <span className="text-2xl font-bold text-[#FFB800]">Rs. {paymentAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
