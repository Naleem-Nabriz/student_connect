import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Link as LinkIcon, FileText, File, Upload } from 'lucide-react';
import { validateResourceForm } from '../validation/resourceValidation';

const ResourceForm = ({ resource, onSubmit, onCancel, loading = false }) => {
  const [errors, setErrors] = useState({});
  const [resourceType, setResourceType] = useState(resource?.type || 'link');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
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
  const hasExistingFile = Boolean(resource?.fileUrl);
  
  React.useEffect(() => {
    if (watchedType !== resourceType) {
      setResourceType(watchedType);
      // Clear URLs and file when type changes
      setValue('fileUrl', '');
      setValue('linkUrl', '');
      setUploadedFile(null);
    }
  }, [watchedType, resourceType, setValue]);

  const onFormSubmit = async (data) => {
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form submission data:', data);
    console.log('Resource type state:', resourceType);
    console.log('Uploaded file state:', uploadedFile);
    console.log('=== FORM SUBMISSION END ===');
    
    // Set fileUrl for validation if we have an uploaded file
    if ((resourceType === 'file' || resourceType === 'document') && uploadedFile) {
      data.fileUrl = uploadedFile;
      console.log('Set fileUrl to uploadedFile:', uploadedFile);
    }
    
    const validationErrors = validateResourceForm(data);
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }
    
    // Handle file upload for file and document types
    console.log('Checking file upload condition:', {
      resourceType,
      data_type: data.type,
      uploadedFile: !!uploadedFile,
      condition: (resourceType === 'file' || resourceType === 'document') && uploadedFile
    });
    
    if ((resourceType === 'file' || resourceType === 'document') && uploadedFile) {
      console.log('Starting file upload process...');
      setUploading(true);
      setUploadProgress(0);
      
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('title', data.title);
        formData.append('subject', data.subject);
        formData.append('description', data.description);
        formData.append('type', data.type);
        formData.append('tags', JSON.stringify(data.tags || []));
        
        console.log('FormData created with file:', uploadedFile.name);
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);
        
        // Call the submit function with FormData
        await onSubmit(formData, true);
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
        
      } catch (error) {
        setUploading(false);
        setUploadProgress(0);
        setErrors({ submit: error.message });
        return;
      }
    } else {
      console.log('Using regular form submission (not file upload)');
      console.log('Reasons:', {
        isNotFileType: !(resourceType === 'file' || resourceType === 'document'),
        noUploadedFile: !uploadedFile,
        resourceType,
        uploadedFile: !!uploadedFile
      });
      
      // Process tags for link type
      if (data.tags && typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
      
      setErrors({});
      onSubmit(data, false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file);
    
    if (file) {
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        console.log('File too large:', file.size);
        setErrors({ fileUrl: 'File size must be less than 10MB' });
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        console.log('File type not allowed:', file.type);
        setErrors({ fileUrl: 'File type not supported. Please upload PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, or image files.' });
        return;
      }
      
      console.log('File validation passed, setting uploadedFile');
      setUploadedFile(file);
      setErrors(prev => ({ ...prev, fileUrl: undefined }));
    } else {
      console.log('No file selected');
    }
  };

  const handleInputChange = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formValues = watch();
  const isFormValid = (() => {
    const errors = validateResourceForm({
      ...formValues,
      fileUrl: (resourceType === 'file' || resourceType === 'document') ? uploadedFile : formValues.fileUrl
    });
    return Object.keys(errors).length === 0;
  })();

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

          {/* File Upload for file and document types */}
          {(resourceType === 'file' || resourceType === 'document') ? (
            <div>
              <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Upload File *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="fileUrl"
                      className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="fileUrl"
                        type="file"
                        required={!hasExistingFile}
                        onChange={handleFileSelect}
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF up to 10MB
                  </p>
                  {hasExistingFile && !uploadedFile && (
                    <p className="text-xs text-gray-500">
                      Current file will be kept unless you choose a replacement.
                    </p>
                  )}
                </div>
              </div>
              
              {uploadedFile && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <File className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {uploading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">Uploading...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.fileUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.fileUrl}</p>
              )}
            </div>
          ) : (
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
              disabled={
                isSubmitting ||
                loading ||
                uploading ||
                !isFormValid ||
                ((resourceType === 'file' || resourceType === 'document') && !uploadedFile && !hasExistingFile)
              }
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading || uploading ? (
                <div className="flex items-center">
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  {uploading ? 'Uploading...' : (resource ? 'Updating...' : 'Sharing...')}
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
