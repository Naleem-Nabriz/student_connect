import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash2 } from 'lucide-react';
import { validateSkillProfile } from '../validation/skillValidation';

const SkillProfileForm = ({ profile, onSubmit, onCancel, loading = false }) => {
  const [errors, setErrors] = useState({});
  const [skills, setSkills] = useState(
    profile?.skills || [{ name: '', level: 'intermediate', category: '' }]
  );
  
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm({
    defaultValues: profile || {
      bio: '',
      availability: 'available',
    },
  });

  const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const availabilityOptions = ['available', 'busy', 'offline'];

  const addSkill = () => {
    setSkills([...skills, { name: '', level: 'intermediate', category: '' }]);
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const updateSkill = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      skills: skills.filter(skill => skill.name.trim()),
    };

    const validationErrors = validateSkillProfile(formData);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {profile ? 'Edit Skill Profile' : 'Create Skill Profile'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Skills Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Skills *
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
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Skill name (e.g., JavaScript, Mathematics)"
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
                  <input
                    type="text"
                    placeholder="Category (optional)"
                    value={skill.category}
                    onChange={(e) => updateSkill(index, 'category', e.target.value)}
                    className="form-input w-32"
                  />
                  {skills.length > 1 && (
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
            
            {errors.skills && (
              <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              {...register('bio')}
              onChange={() => handleInputChange('bio')}
              rows={4}
              className={`form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.bio ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Tell others about your learning goals and what you're looking for in study partners..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {500 - (register('bio').value?.length || 0)} characters remaining
            </p>
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
              Availability Status
            </label>
            <select
              {...register('availability')}
              onChange={() => handleInputChange('availability')}
              className={`form-input block w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.availability ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {availabilityOptions.map(option => (
                <option key={option} value={option} className="capitalize">
                  {option}
                </option>
              ))}
            </select>
            {errors.availability && (
              <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
            )}
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
                  {profile ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                profile ? 'Update Profile' : 'Create Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillProfileForm;
