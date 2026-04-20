import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar } from 'lucide-react';

const RecordForm = ({ record, subjects, onSubmit, onCancel, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    shouldUnregister: true,
    defaultValues: record || {
      subjectId: '',
      quizMarks: '',
      midtermMarks: '',
      assignmentMarks: '',
      finalMarks: '',
      attendance: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const subjectIdField = register('subjectId');
  const dateField = register('date');

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      quizMarks: data.quizMarks !== '' ? parseFloat(data.quizMarks) : undefined,
      midtermMarks: data.midtermMarks !== '' ? parseFloat(data.midtermMarks) : undefined,
      assignmentMarks: data.assignmentMarks !== '' ? parseFloat(data.assignmentMarks) : undefined,
      finalMarks: data.finalMarks !== '' ? parseFloat(data.finalMarks) : undefined,
      attendance: data.attendance !== '' ? parseFloat(data.attendance) : undefined,
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
        <div className="flex items-center justify-between border-b border-[#eadfce] bg-[linear-gradient(135deg,rgba(224,122,95,0.10),rgba(242,201,76,0.14))] p-6">
          <h2 className="text-xl font-semibold text-[#3D3D3D]">
            {record ? 'Edit Record' : 'Add New Record'}
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
            <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <select
              {...subjectIdField}
              required
              onInvalid={handleInvalid}
              onChange={(event) => {
                subjectIdField.onChange(event);
                clearValidationMessage(event);
              }}
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
            <label htmlFor="quizMarks" className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Marks
            </label>
            <input
              {...register('quizMarks')}
              type="number"
              min="0"
              max="100"
              step="0.01"
              className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="85"
            />
          </div>

          <div>
            <label htmlFor="midtermMarks" className="block text-sm font-medium text-gray-700 mb-1">
              Mid Term Marks
            </label>
            <input
              {...register('midtermMarks')}
              type="number"
              min="0"
              max="100"
              step="0.01"
              className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="78"
            />
          </div>

          <div>
            <label htmlFor="assignmentMarks" className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Marks
            </label>
            <input
              {...register('assignmentMarks')}
              type="number"
              min="0"
              max="100"
              step="0.01"
              className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="90"
            />
          </div>

          <div>
            <label htmlFor="finalMarks" className="block text-sm font-medium text-gray-700 mb-1">
              Final Marks
            </label>
            <input
              {...register('finalMarks')}
              type="number"
              min="0"
              max="100"
              step="0.01"
              className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="88"
            />
          </div>

          <div>
            <label htmlFor="attendance" className="block text-sm font-medium text-gray-700 mb-1">
              Attendance
            </label>
            <input
              {...register('attendance')}
              type="number"
              min="0"
              max="100"
              step="0.01"
              className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="92"
            />
            <div className="mt-1 rounded-2xl border border-[#eadfce] bg-[#fffaf2] px-3 py-2 text-sm text-[#62574d]">
              Enter all four mark types and attendance together in one record.
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#85786c]" />
              <input
                {...dateField}
                type="date"
                required
                onInvalid={handleInvalid}
                onChange={(event) => {
                  dateField.onChange(event);
                  clearValidationMessage(event);
                }}
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
              maxLength="500"
              className="form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Additional notes about this record..."
            />
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
