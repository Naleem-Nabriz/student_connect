import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const SubjectForm = ({ subject, onSubmit, onCancel, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: subject || {
      name: '',
      code: '',
      credits: '',
      semester: '',
      targetMarks: '',
      targetAttendance: '',
      weeklyStudyHours: '',
    },
  });

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      credits: data.credits ? parseInt(data.credits) : undefined,
      targetMarks: data.targetMarks ? parseInt(data.targetMarks) : undefined,
      targetAttendance: data.targetAttendance ? parseInt(data.targetAttendance) : undefined,
      weeklyStudyHours: data.weeklyStudyHours ? parseFloat(data.weeklyStudyHours) : undefined,
    };
    
    onSubmit(formData);
  };

  const handleInvalid = (event) => {
    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Please fill this field');
    }
  };

  const clearValidationMessage = (event) => {
    event.target.setCustomValidity('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D3D3D]/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-[#eadfce] bg-[#fffaf4] shadow-[0_30px_80px_rgba(61,61,61,0.18)]">
        <div className="flex items-center justify-between border-b border-[#eadfce] bg-[linear-gradient(135deg,rgba(0,119,182,0.10),rgba(242,201,76,0.14))] p-6">
          <h2 className="text-xl font-semibold text-[#3D3D3D]">
            {subject ? 'Edit Subject' : 'Add New Subject'}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-full p-2 text-[#85786c] transition-colors hover:bg-white/70 hover:text-[#3D3D3D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name *
            </label>
            <input
              {...register('name')}
              type="text"
              required
              minLength="2"
              maxLength="100"
              onInvalid={handleInvalid}
              onInput={clearValidationMessage}
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Mathematics, Computer Science"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Code
            </label>
            <input
              {...register('code')}
              type="text"
              maxLength="20"
              pattern="[A-Z0-9]+"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., MATH101, CS201"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                Credits
              </label>
              <input
                {...register('credits')}
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="3"
              />
            </div>

            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <input
                {...register('semester')}
                type="text"
                maxLength="50"
                className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Fall 2024"
              />
            </div>
          </div>

          <div className="border-t border-[#eadfce] pt-4">
            <h3 className="mb-3 text-sm font-semibold text-[#3D3D3D]">Goal Tracking</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="targetMarks" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Marks
                </label>
                <input
                  {...register('targetMarks')}
                  type="number"
                  min="0"
                  max="100"
                  className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="85"
                />
              </div>

              <div>
                <label htmlFor="targetAttendance" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Attendance
                </label>
                <input
                  {...register('targetAttendance')}
                  type="number"
                  min="0"
                  max="100"
                  className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="90"
                />
              </div>

              <div>
                <label htmlFor="weeklyStudyHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Study Hours
                </label>
                <input
                  {...register('weeklyStudyHours')}
                  type="number"
                  min="0"
                  max="168"
                  step="0.5"
                  className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="6"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || loading}
              className="rounded-full border border-[#d9cab6] bg-white px-5 py-2.5 text-sm font-medium text-[#5d544d] transition-colors hover:bg-[#fff7ed] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="rounded-full border border-transparent bg-[#0077B6] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#005f92] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting || loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  {subject ? 'Updating...' : 'Adding...'}
                </div>
              ) : (
                subject ? 'Update Subject' : 'Add Subject'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
