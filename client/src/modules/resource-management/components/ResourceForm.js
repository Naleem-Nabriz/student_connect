import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Link as LinkIcon, FileText, File } from 'lucide-react';
import { validateResourceForm } from '../validation/resourceValidation';

const ResourceForm = ({ resource, onSubmit, onCancel, loading = false }) => {
  const [errors, setErrors] = useState({});
  const [resourceType, setResourceType] = useState(resource?.type || 'link');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    setValue,
  } = useForm({
    defaultValues: resource || {
      title: '',
      subject: '',
      description: '',
      type: 'link',
      fileUrl: '',
      linkUrl: '',
      tags: [],
    },
  });

  const watchedType = watch('type');
  
  React.useEffect(() => {
    if (watchedType !== resourceType) {
      setResourceType(watchedType);
      // Clear URLs when type changes
      setValue('fileUrl', '');
      setValue('linkUrl', '');
    }
  }, [watchedType, resourceType, setValue]);

  const onFormSubmit = (data) => {
    const validationErrors = validateResourceForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Process tags
    if (data.tags && typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    setErrors({});
    onSubmit(data);
  };

  const handleInputChange = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formValues = watch();
  const isFormValid = Object.keys(validateResourceForm(formValues || {})).length === 0;

  const resourceTypes = [
    { value: 'link', label: 'Link', icon: LinkIcon, description: 'External website or resource' },
    { value: 'file', label: 'File', icon: File, description: 'Uploaded file (PDF, DOC, etc.)' },
    { value: 'document', label: 'Document', icon: FileText, description: 'Text document or notes' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {resource ? 'Edit Resource' : 'Share New Resource'}
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
              Resource Title *
            </label>
            <input
              {...register('title')}
              type="text"
              required
              minLength="3"
              maxLength="200"
              onChange={() => handleInputChange('title')}
              className={`form-input block w-full px-3 py-2 border rounded-md ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : formValues.title?.trim()
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Enter a descriptive title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                {...register('subject')}
                type="text"
                required
                minLength="2"
                maxLength="100"
                onChange={() => handleInputChange('subject')}
                className={`form-input block w-full px-3 py-2 border rounded-md ${
                  errors.subject
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : formValues.subject?.trim()
                    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
                placeholder="e.g., Mathematics, Computer Science"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type *
              </label>
              <select
                {...register('type')}
                required
                onChange={() => handleInputChange('type')}
                className={`form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {resourceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              onChange={() => handleInputChange('description')}
              rows={3}
              maxLength="1000"
              className={`form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe what this resource contains and how it can be helpful"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* URL Input based on type */}
          {resourceType === 'link' ? (
            <div>
              <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Link URL *
              </label>
              <input
                {...register('linkUrl')}
                type="url"
                required
                onChange={() => handleInputChange('linkUrl')}
                className={`form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                  errors.linkUrl ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/resource"
              />
              {errors.linkUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.linkUrl}</p>
              )}
            </div>
          ) : (
            <div>
              <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 mb-1">
                File URL *
              </label>
              <input
                {...register('fileUrl')}
                type="url"
                required
                onChange={() => handleInputChange('fileUrl')}
                className={`form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                  errors.fileUrl ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/file.pdf"
              />
              {errors.fileUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.fileUrl}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter the URL where the file is hosted (e.g., cloud storage, file sharing service)
              </p>
            </div>
          )}

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              {...register('tags')}
              type="text"
              maxLength="200"
              pattern="^[a-zA-Z0-9\s,-]+$"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="math, calculus, tutorial (comma-separated)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas to help others find this resource
            </p>
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
              disabled={isSubmitting || loading || !isFormValid}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  {resource ? 'Updating...' : 'Sharing...'}
                </div>
              ) : (
                resource ? 'Update Resource' : 'Share Resource'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
