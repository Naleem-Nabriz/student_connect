import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { kuppiAdService } from '../services/kuppiAdApi';
import toast from 'react-hot-toast';

const KuppiAdCard = ({ ad, onUpdate, onDelete, onApprove, onReject, onEnroll, currentUser }) => {
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [updatedAd, setUpdatedAd] = useState(ad);
  
  const isOwner = updatedAd.createdBy._id === user?.id;
  const isAdmin = user?.role === 'admin';

  // Check if student is already enrolled
  useEffect(() => {
    if (user && updatedAd.enrolledStudents) {
      const enrolled = updatedAd.enrolledStudents.some(
        enrollment => enrollment.student?._id === user.id || enrollment.student === user.id
      );
      setIsEnrolled(enrolled);
    }
  }, [updatedAd, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return (
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 008 0v-4a2 2 0 00-2 2v6a2 2 0 00-2 2 2 2v6a2 2 0 002 2l-3 3a2 2 0 004-2l-3-3a2 2 0 00-2z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 008 0v-1a1 1 0 00-2 2v1a1 1 0 002 2l-3 3a1 1 0 004-2l-3-3a1 1 0 002-2z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 008 0v-2a2 2 0 00-2 2v2a2 2 0 002 2l-3 3a2 2 0 004-2l-3-3a2 2 0 002-2z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 008 0v-1a1 1 0 00-2 2v1a1 1 0 002 2l-3 3a1 1 0 004-2l-3-3a1 1 0 002-2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'approved':
        return 'This ad is approved and visible to all students';
      case 'pending':
        return 'Your ad is under review by administrators';
      case 'rejected':
        return 'This ad was rejected. Please contact admin for details';
      default:
        return '';
    }
  };

  const handleEdit = () => {
    if (onUpdate) {
      onUpdate(ad);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await kuppiAdService.deleteAd(ad._id);
        toast.success('Ad deleted successfully');
        if (onDelete) onDelete();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleApprove = async () => {
    try {
      await kuppiAdService.approveAd(ad._id);
      toast.success('Ad approved successfully');
      if (onApprove) onApprove();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Rejection reason (optional):');
    if (reason !== null) {
      try {
        await kuppiAdService.rejectAd(ad._id, reason);
        toast.success('Ad rejected successfully');
        if (onReject) onReject();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll');
      return;
    }

    setEnrollmentLoading(true);
    try {
      const result = await kuppiAdService.enrollClass(updatedAd._id);
      
      // Update local state with new enrollment count
      setUpdatedAd(result.kuppiClass || result);
      setIsEnrolled(true);
      toast.success('Enrolled successfully!');
      
      // Call parent callback if provided
      if (onEnroll) {
        onEnroll(result.kuppiClass || result);
      }
    } catch (error) {
      toast.error(error.message);
      setEnrollmentLoading(false);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm('Are you sure you want to unenroll from this class?')) {
      return;
    }

    setEnrollmentLoading(true);
    try {
      const result = await kuppiAdService.unenrollClass(updatedAd._id);
      
      // Update local state with new enrollment count
      setUpdatedAd(result.kuppiClass || result);
      setIsEnrolled(false);
      toast.success('Unenrolled successfully!');
      
      // Call parent callback if provided
      if (onEnroll) {
        onEnroll(result.kuppiClass || result);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1C22] border border-[#2A2D36] rounded-xl shadow-lg p-6 hover:shadow-xl hover:border-[#FF7A00] transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(updatedAd.status)}`}>
              {getStatusIcon(updatedAd.status)}
              <span className="ml-1 capitalize">{updatedAd.status}</span>
            </span>
            <span className="text-xs text-gray-500">{updatedAd.subject}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{updatedAd.title}</h3>
          <p className="text-sm text-[#A0A3BD] line-clamp-3">{updatedAd.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-[#A0A3BD]">
            <div>
              <span className="font-medium text-white">Tutor:</span> {updatedAd.tutorName}
            </div>
            <div>
              <span className="font-medium text-white">Contact:</span> {updatedAd.contactInfo}
            </div>
            <div>
              <span className="font-medium text-white">Location:</span> {updatedAd.location}
            </div>
            <div>
              <span className="font-medium text-white">Type:</span> {updatedAd.classType}
            </div>
            <div>
              <span className="font-medium text-white">Date:</span> {new Date(updatedAd.date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium text-white">Time:</span> {updatedAd.time}
            </div>
            <div>
              <span className="font-medium text-white">Price:</span> Rs. {updatedAd.price}
            </div>
            <div>
              <span className="font-medium text-white">Max Students:</span> {updatedAd.maxStudents}
            </div>
            <div>
              <span className="font-medium text-white">Enrolled:</span> {updatedAd.currentEnrollments}/{updatedAd.maxStudents}
            </div>
          </div>
          
          {getStatusMessage(updatedAd.status) && (
            <div className="mt-2 p-2 bg-[#111217] border border border-[#2A2D36] rounded-md">
              <p className="text-sm text-[#FF7A00]">{getStatusMessage(updatedAd.status)}</p>
            </div>
          )}

          {/* Enrollment button for students viewing approved classes */}
          {updatedAd.status === 'approved' && !isOwner && !isAdmin && (
            <div className="mt-4">
              {isEnrolled ? (
                <button
                  onClick={handleUnenroll}
                  disabled={enrollmentLoading || updatedAd.currentEnrollments >= updatedAd.maxStudents}
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {enrollmentLoading ? 'Processing...' : 'Enrolled ✓'}
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrollmentLoading || updatedAd.currentEnrollments >= updatedAd.maxStudents}
                  className={`w-full py-2 px-4 text-white rounded-lg font-medium transition-colors duration-200 ${
                    updatedAd.currentEnrollments >= updatedAd.maxStudents
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-[#FF7A00] hover:bg-[#E86A00]'
                  } disabled:cursor-not-allowed`}
                >
                  {enrollmentLoading ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {(isOwner || isAdmin) && (
            <>
              <button
                onClick={handleEdit}
                className="p-2 text-[#FFB800] hover:bg-[#1A1C22] rounded-full transition-colors"
                title="Edit ad"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h2a2 2 0 002 2v-2a2 2 0 00-2z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-[#EF4444] hover:bg-[#1A1C22] rounded-full transition-colors"
                title="Delete ad"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 002-2 2H7a2 2 0 00-2-2v-2a2 2 0 002-2l-3 3a2 2 0 004-2l-3-3a2 2 0 002-2z" />
                </svg>
              </button>
            </>
          )}
          
          {isAdmin && updatedAd.status === 'pending' && (
            <>
              <button
                onClick={handleApprove}
                className="p-2 text-[#22C55E] hover:bg-[#1A1C22] rounded-full transition-colors"
                title="Approve ad"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L5 5l-4 4M5 13l4 4L5 5z" />
                </svg>
              </button>
              <button
                onClick={handleReject}
                className="p-2 text-[#EF4444] hover:bg-[#1A1C22] rounded-full transition-colors"
                title="Reject ad"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 002-2 2H7a2 2 0 00-2-2v-2a2 2 0 002-2l-3 3a2 2 0 004-2l-3-3a2 2 0 002-2z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KuppiAdCard;
