import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { kuppiAdService } from '../services/kuppiAdApi';
import { CheckCircle2, Clock3, XCircle, Edit3, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const KuppiAdCard = ({ ad, onUpdate, onDelete, onApprove, onReject, onEnroll }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [updatedAd, setUpdatedAd] = useState(ad);

  const currentUserId = user?._id || user?.id;
  const createdById =
    updatedAd?.createdBy?._id || updatedAd?.createdBy?.id || updatedAd?.createdBy;

  const isOwner = createdById === currentUserId;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setUpdatedAd(ad);
  }, [ad]);

  useEffect(() => {
    if (currentUserId && updatedAd.enrolledStudents) {
      const enrolled = updatedAd.enrolledStudents.some(
        (enrollment) =>
          enrollment.student?._id === currentUserId ||
          enrollment.student?.id === currentUserId ||
          enrollment.student === currentUserId
      );
      setIsEnrolled(enrolled);
    } else {
      setIsEnrolled(false);
    }
  }, [updatedAd, currentUserId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-[#d9ecf7] text-[#0b5f8f]';
      case 'pending':
        return 'bg-[#fff1cc] text-[#8a6a10]';
      case 'rejected':
        return 'bg-[#f6e3dc] text-[#b85f47]';
      default:
        return 'bg-[#efe4d8] text-[#62574d]';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-[#0077B6]" />;
      case 'pending':
        return <Clock3 className="h-4 w-4 text-[#8a6a10]" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-[#E07A5F]" />;
      default:
        return <Clock3 className="h-4 w-4 text-[#62574d]" />;
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

    if (isOwner) {
      toast.error('You cannot enroll in your own class');
      return;
    }

    // Check if class is free
    if (updatedAd.price === 0) {
      // FREE CLASS - Direct enrollment
      setEnrollmentLoading(true);
      try {
        const result = await kuppiAdService.enrollClass(updatedAd._id);
        setUpdatedAd(result.kuppiClass || result);
        setIsEnrolled(true);
        toast.success('Enrolled successfully (Free Class)');

        if (onEnroll) {
          onEnroll(result.kuppiClass || result);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setEnrollmentLoading(false);
      }
    } else {
      // PAID CLASS - Go to payment
      navigate(`/kuppi/payment/${updatedAd._id}`, {
        state: {
          ad: updatedAd
        }
      });
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm('Are you sure you want to unenroll from this class?')) {
      return;
    }

    setEnrollmentLoading(true);
    try {
      const result = await kuppiAdService.unenrollClass(updatedAd._id);
      setUpdatedAd(result.kuppiClass || result);
      setIsEnrolled(false);
      toast.success('Unenrolled successfully!');

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
    <div className="rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(253,246,236,0.92))] p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0077B6]/30 hover:shadow-[0_22px_55px_rgba(61,61,61,0.12)]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(updatedAd.status)}`}>
              {getStatusIcon(updatedAd.status)}
              <span className="ml-1 capitalize">{updatedAd.status}</span>
            </span>
            {updatedAd.price === 0 && (
              <span className="inline-flex items-center rounded-full bg-[#d9f1ea] px-2.5 py-0.5 text-xs font-medium text-[#0c6e59]">
                FREE
              </span>
            )}
            <span className="text-xs text-[#85786c]">{updatedAd.subject}</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[#3D3D3D]">{updatedAd.title}</h3>
          <p className="line-clamp-3 text-sm text-[#62574d]">{updatedAd.description}</p>

          <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-[#62574d]">
            <div><span className="font-medium text-[#3D3D3D]">Tutor:</span> {updatedAd.tutorName}</div>
            <div><span className="font-medium text-[#3D3D3D]">Contact:</span> {updatedAd.contactInfo}</div>
            <div><span className="font-medium text-[#3D3D3D]">Location:</span> {updatedAd.location}</div>
            <div><span className="font-medium text-[#3D3D3D]">Type:</span> {updatedAd.classType}</div>
            <div><span className="font-medium text-[#3D3D3D]">Date:</span> {new Date(updatedAd.date).toLocaleDateString()}</div>
            <div><span className="font-medium text-[#3D3D3D]">Time:</span> {updatedAd.time}</div>
            <div><span className="font-medium text-[#3D3D3D]">Price:</span> 
              {updatedAd.price === 0 ? (
                <span className="font-semibold text-[#0c6e59]">FREE</span>
              ) : (
                <span className="text-[#b85f47]">Rs. {updatedAd.price}</span>
              )}
            </div>
            <div><span className="font-medium text-[#3D3D3D]">Max Students:</span> {updatedAd.maxStudents}</div>
            <div><span className="font-medium text-[#3D3D3D]">Enrolled:</span> {updatedAd.currentEnrollments}/{updatedAd.maxStudents}</div>
          </div>

          {getStatusMessage(updatedAd.status) && (
            <div className="mt-3 rounded-2xl border border-[#eadfce] bg-[#fffaf2] p-3">
              <p className="text-sm text-[#62574d]">{getStatusMessage(updatedAd.status)}</p>
            </div>
          )}

          {updatedAd.status === 'approved' && !isOwner && !isAdmin && (
            <div className="mt-4">
              {isEnrolled ? (
                <button
                  onClick={handleUnenroll}
                  disabled={enrollmentLoading}
                  className="w-full rounded-full bg-[#E07A5F] px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-[#c96a52] disabled:cursor-not-allowed disabled:bg-[#d7c8b7]"
                >
                  {enrollmentLoading ? 'Processing...' : 'Unenroll'}
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrollmentLoading || updatedAd.currentEnrollments >= updatedAd.maxStudents}
                  className={`w-full rounded-full px-4 py-2 font-medium transition-colors duration-200 ${
                    updatedAd.currentEnrollments >= updatedAd.maxStudents
                      ? 'cursor-not-allowed bg-[#d7c8b7] text-[#62574d]'
                      : 'bg-[#0077B6] text-white hover:bg-[#005f92]'
                  } disabled:cursor-not-allowed`}
                >
                  {enrollmentLoading ? 'Enrolling...' : (updatedAd.price === 0 ? 'Enroll Now' : 'Enroll & Pay')}
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
                className="rounded-full p-2 text-[#0077B6] transition-colors hover:bg-[#d9ecf7]"
                title="Edit ad"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-full p-2 text-[#E07A5F] transition-colors hover:bg-[#f6e3dc]"
                title="Delete ad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {isAdmin && updatedAd.status === 'pending' && (
            <>
              <button
                onClick={handleApprove}
                className="rounded-full p-2 text-[#0077B6] transition-colors hover:bg-[#d9ecf7]"
                title="Approve ad"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleReject}
                className="rounded-full p-2 text-[#E07A5F] transition-colors hover:bg-[#f6e3dc]"
                title="Reject ad"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KuppiAdCard;
