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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {subject ? 'Edit Subject' : 'Add New Subject'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
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
                className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Fall 2024"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Goal Tracking</h3>
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
                  max="100"
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
