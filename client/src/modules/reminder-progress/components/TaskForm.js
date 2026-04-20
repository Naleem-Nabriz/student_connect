import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

const TaskForm = ({ task, onSubmit, onCancel, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch
  } = useForm({
    defaultValues: task || {
      title: '',
      description: '',
      deadline: '',
      studySessionDate: '',
      priority: 'medium',
      category: 'general',
      reminderRules: ['1day', '6hours']
    }
  });

  const selectedReminders = watch('reminderRules') || [];

  const handleReminderToggle = (rule) => {
    const current = selectedReminders.includes(rule);
    if (current) {
      setValue('reminderRules', selectedReminders.filter(r => r !== rule));
    } else {
      setValue('reminderRules', [...selectedReminders, rule]);
    }
  };

  const onFormSubmit = async (data) => {
    try {
      if (task) {
        await taskService.updateTask(task._id, data);
        toast.success('Task updated successfully!');
      } else {
        await taskService.createTask(data);
        toast.success('Task created successfully!');
      }
      onSubmit();
    } catch (error) {
      toast.error(error.message || 'Failed to save task');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              {...register('title', { required: true })}
              type="text"
              required
              minLength="1"
              maxLength="200"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              maxLength="1000"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add task description (optional)"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Deadline *
            </label>
            <input
              {...register('deadline', { required: true })}
              type="datetime-local"
              required
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="studySessionDate" className="block text-sm font-medium text-gray-700 mb-1">
              Study Session Date
            </label>
            <input
              {...register('studySessionDate')}
              type="datetime-local"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                {...register('priority')}
                className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                {...register('category')}
                type="text"
                maxLength="50"
                className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Study, Work, Personal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Settings
            </label>
            <div className="space-y-2">
              {[
                { value: '7days', label: '7 days before' },
                { value: '3days', label: '3 days before' },
                { value: '1day', label: '1 day before' },
                { value: '6hours', label: '6 hours before' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedReminders.includes(value)}
                    onChange={() => handleReminderToggle(value)}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
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
                  {task ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
