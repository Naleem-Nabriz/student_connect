import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, BookOpen } from 'lucide-react';
import ResourceRecommendations from './ResourceRecommendations';

const GroupForm = ({ group, onSubmit, onCancel, loading = false }) => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: group || {
      name: '',
      subject: '',
      description: '',
      capacity: 10,
    },
  });

  const formValues = watch();

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleResourceSelect = (resource) => {
    // Could implement resource sharing or linking functionality here
    console.log('Selected resource:', resource);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {group ? 'Edit Group' : 'Create New Group'}
            </h2>
            <div className="flex items-center space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="flex items-center px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                {showRecommendations ? 'Hide' : 'Show'} Resources
              </button>
            </div>
          </div>
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
              Group Name *
            </label>
            <input
              {...register('name')}
              type="text"
              required
              minLength="2"
              maxLength="100"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter group name"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              {...register('subject')}
              type="text"
              required
              minLength="2"
              maxLength="50"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Mathematics, Computer Science"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              maxLength="500"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe the group's purpose and goals"
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacity *
            </label>
            <input
              {...register('capacity', { valueAsNumber: true })}
              type="number"
              required
              min="2"
              max="50"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Maximum number of members"
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
                  {group ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                group ? 'Update Group' : 'Create Group'
              )}
            </button>
          </div>
        </form>

        {/* Resource Recommendations Section */}
        {showRecommendations && (
          <div className="border-t border-gray-200">
            <ResourceRecommendations
              groupData={formValues}
              onResourceSelect={handleResourceSelect}
              className="border-0 rounded-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupForm;
