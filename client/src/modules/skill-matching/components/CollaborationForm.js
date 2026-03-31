import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash2, Calendar } from 'lucide-react';
import { validateCollaboration } from '../validation/skillValidation';

const CollaborationForm = ({ collaboration, onSubmit, onCancel, loading = false }) => {
  const [errors, setErrors] = useState({});
  const [requiredSkills, setRequiredSkills] = useState(
    collaboration?.requiredSkills || [{ name: '', level: 'intermediate' }]
  );
  
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm({
    defaultValues: collaboration || {
      title: '',
      description: '',
      deadline: '',
    },
  });

  const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

  const addSkill = () => {
    setRequiredSkills([...requiredSkills, { name: '', level: 'intermediate' }]);
  };

  const removeSkill = (index) => {
    const newSkills = requiredSkills.filter((_, i) => i !== index);
    setRequiredSkills(newSkills);
  };

  const updateSkill = (index, field, value) => {
    const newSkills = [...requiredSkills];
    newSkills[index][field] = value;
    setRequiredSkills(newSkills);
  };

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      requiredSkills: requiredSkills.filter(skill => skill.name.trim()),
    };

    const validationErrors = validateCollaboration(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    onSubmit(formData);
  };

  const handleInputChange = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {collaboration ? 'Edit Collaboration Request' : 'Create Collaboration Request'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title *
            </label>
            <input
              {...register('title')}
              type="text"
              onChange={() => handleInputChange('title')}
              className={`form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter a descriptive title for your collaboration"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Project Description *
            </label>
            <textarea
              {...register('description')}
              onChange={() => handleInputChange('description')}
              rows={4}
              className={`form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe your project, goals, and what you're looking for in collaborators..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {1000 - (register('description').value?.length || 0)} characters remaining
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Required Skills *
              </label>
              <button
                type="button"
                onClick={addSkill}
                className="flex items-center px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </button>
            </div>
            
            <div className="space-y-3">
              {requiredSkills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Skill name (e.g., React, Data Analysis)"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      className="form-input w-full"
                    />
                  </div>
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(index, 'level', e.target.value)}
                    className="form-input"
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level} className="capitalize">
                        {level}
                      </option>
                    ))}
                  </select>
                  {requiredSkills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {errors.requiredSkills && (
              <p className="mt-1 text-sm text-red-600">{errors.requiredSkills}</p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Deadline (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                {...register('deadline')}
                type="date"
                min={today}
                onChange={() => handleInputChange('deadline')}
                className={`form-input block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                  errors.deadline ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Set a deadline for your collaboration request
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
              disabled={isSubmitting || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  {collaboration ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                collaboration ? 'Update Request' : 'Create Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaborationForm;
