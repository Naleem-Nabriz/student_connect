import React, { useEffect, useState } from 'react';
import { kuppiAdService } from '../services/kuppiAdApi';
import toast from 'react-hot-toast';

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? '00' : '30';
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${displayHour}:${minute} ${period}`;
});

const parseTimeRange = (timeRange = '') => {
  const [startTime = '', endTime = ''] = timeRange.split('-').map((value) => value.trim());
  return { startTime, endTime };
};

const buildInitialFormData = (ad) => ({
  title: ad?.title || '',
  subject: ad?.subject || '',
  description: ad?.description || '',
  tutorName: ad?.tutorName || '',
  contactInfo: ad?.contactInfo || '',
  location: ad?.location || '',
  classType: ad?.classType || 'online',
  date: ad?.date ? new Date(ad.date).toISOString().split('T')[0] : '',
  time: ad?.time || '',
  price: ad?.price ?? 0,
  maxStudents: ad?.maxStudents ?? 30,
});

const CreateAd = ({ ad = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(buildInitialFormData(ad));
  const [selectedTimes, setSelectedTimes] = useState(() => parseTimeRange(ad?.time));
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(ad?._id);

  useEffect(() => {
    setFormData(buildInitialFormData(ad));
    setSelectedTimes(parseTimeRange(ad?.time));
  }, [ad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (name, value) => {
    setSelectedTimes((prev) => {
      const updatedTimes = { ...prev, [name]: value };
      const combinedTime = updatedTimes.startTime && updatedTimes.endTime
        ? `${updatedTimes.startTime} - ${updatedTimes.endTime}`
        : '';

      setFormData((prevFormData) => ({
        ...prevFormData,
        time: combinedTime,
      }));

      return updatedTimes;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await kuppiAdService.updateAd(ad._id, formData);
        toast.success('Kuppi ad updated successfully!');
      } else {
        const response = await kuppiAdService.createAd(formData);
        const createdAd = response?.kuppiAd;
        const successMessage = createdAd?.status === 'pending'
          ? 'Kuppi ad submitted for admin approval.'
          : 'Kuppi ad created successfully!';

        toast.success(successMessage);
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D3D3D]/45 backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-8 shadow-[0_30px_80px_rgba(61,61,61,0.18)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#3D3D3D]">
            {isEditMode ? 'Update Kuppi Advertisement' : 'Create Kuppi Advertisement'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#85786c] transition-colors hover:text-[#3D3D3D]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Ad Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength="3"
                maxLength="200"
                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] placeholder-[#85786c] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                placeholder="Enter ad title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                minLength="2"
                maxLength="100"
                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] placeholder-[#85786c] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                placeholder="Enter subject"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                minLength="10"
                maxLength="1000"
                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                placeholder="Enter detailed description"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Tutor Name *
              </label>
              <input
                type="text"
                name="tutorName"
                value={formData.tutorName}
                onChange={handleChange}
                required
                minLength="2"
                maxLength="100"
                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                placeholder="Enter tutor name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Contact Information *
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                minLength="5"
                maxLength="200"
                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                placeholder="Phone number or email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                minLength="2"
                maxLength="200"
                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                placeholder="City or area"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Class Type *
              </label>
              <select
                name="classType"
                value={formData.classType}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
              >
                <option value="online">Online Class</option>
                <option value="physical">Physical Class</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="startTime"
                  value={selectedTimes.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                >
                  <option value="">Start time</option>
                  {TIME_OPTIONS.map((timeOption) => (
                    <option key={`start-${timeOption}`} value={timeOption}>
                      {timeOption}
                    </option>
                  ))}
                </select>

                <select
                  name="endTime"
                  value={selectedTimes.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                >
                  <option value="">End time</option>
                  {TIME_OPTIONS.map((timeOption) => (
                    <option key={`end-${timeOption}`} value={timeOption}>
                      {timeOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Price (Rs) <span className="font-normal text-[#85786c]">- Enter 0 for FREE class</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                max="50000"
                step="0.01"
                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-[#85786c]">
                {formData.price === 0 ? 'This will be a FREE class - students can enroll directly without payment' : 'Students will need to pay before enrolling'}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                Maximum Students
              </label>
              <input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
                placeholder="30"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d9cab6] bg-white px-5 py-2.5 text-[#5d544d] transition-colors hover:bg-[#fff7ed]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[linear-gradient(135deg,#0077B6,#E07A5F)] px-6 py-2.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Ad' : 'Create Ad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAd;
