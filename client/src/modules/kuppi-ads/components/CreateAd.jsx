import React, { useEffect, useState } from 'react';
import { kuppiAdService } from '../services/kuppiAdApi';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(ad?._id);

  useEffect(() => {
    setFormData(buildInitialFormData(ad));
  }, [ad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1C22] rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-[#2A2D36]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditMode ? 'Update Kuppi Advertisement' : 'Create Kuppi Advertisement'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#A0A3BD] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
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
                className="w-full px-3 py-2 bg-[#111217] border border-[#2A2D36] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-white placeholder-[#A0A3BD]"
                placeholder="Enter ad title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
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
                className="w-full px-3 py-2 bg-[#111217] border border-[#2A2D36] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-white placeholder-[#A0A3BD]"
                placeholder="Enter subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter detailed description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter tutor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Phone number or email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="City or area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Type *
              </label>
              <select
                name="classType"
                value={formData.classType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="online">Online Class</option>
                <option value="physical">Physical Class</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                minLength="5"
                maxLength="50"
                pattern="[0-9]{1,2}(:[0-9]{2})?\s*(AM|PM|am|pm)\s*-\s*[0-9]{1,2}(:[0-9]{2})?\s*(AM|PM|am|pm)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 6:00 PM - 8:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Rs)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                max="50000"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Students
              </label>
              <input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="30"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#A0A3BD] bg-[#111217] border border-[#2A2D36] hover:bg-[#2A2D36] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-gradient-to-r from-[#FF7A00] to-[#FFB800] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
