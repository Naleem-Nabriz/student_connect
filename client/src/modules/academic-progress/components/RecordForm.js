import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar } from 'lucide-react';

const RecordForm = ({ record, subjects, onSubmit, onCancel, loading = false }) => {
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    setValue,
  } = useForm({
    defaultValues: record || {
      subjectId: '',
      marks: '',
      attendance: '',
      assignmentScore: '',
      testType: 'quiz',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const testTypes = [
    { value: 'quiz', label: 'Quiz' },
    { value: 'midterm', label: 'Midterm' },
    { value: 'final', label: 'Final' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'project', label: 'Project' },
  ];

  const notesValue = watch('notes') || '';
  const formValues = watch();

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      marks: data.marks ? parseFloat(data.marks) : undefined,
      attendance: data.attendance ? parseFloat(data.attendance) : undefined,
      assignmentScore: data.assignmentScore ? parseFloat(data.assignmentScore) : undefined,
    };

    onSubmit(formData);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {record ? 'Edit Record' : 'Add New Record'}
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
            <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <select
              {...register('subjectId')}
              className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-1">
              Test Type
            </label>
            <select
              {...register('testType')}
              className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              {testTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
                Marks
              </label>
              <input
                {...register('marks')}
                type="number"
                className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="85"
              />
            </div>

            <div>
              <label htmlFor="attendance" className="block text-sm font-medium text-gray-700 mb-1">
                Attendance %
              </label>
              <input
                {...register('attendance')}
                type="number"
                className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="90"
              />
            </div>

            <div>
              <label htmlFor="assignmentScore" className="block text-sm font-medium text-gray-700 mb-1">
                Assignment
              </label>
              <input
                {...register('assignmentScore')}
                type="number"
                className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="88"
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                {...register('date')}
                type="date"
                className="form-input block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Additional notes about this record..."
            />
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
                  {record ? 'Updating...' : 'Adding...'}
                </div>
              ) : (
                record ? 'Update Record' : 'Add Record'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;
