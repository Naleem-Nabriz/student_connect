import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash2, Link, Clock, MapPin, Users, Award, CheckCircle } from 'lucide-react';
import { validateSkillProfile } from '../validation/skillValidation';

const SkillProfileForm = ({ profile, onSubmit, onCancel, loading = false }) => {
  const [errors, setErrors] = useState({});
  const [skills, setSkills] = useState(
    profile?.skills || [{ name: '', level: 'intermediate', category: '', verified: false }]
  );
  const [portfolioLinks, setPortfolioLinks] = useState(
    profile?.portfolioLinks || [{ title: '', url: '', type: 'github' }]
  );
  const [studyPreferences, setStudyPreferences] = useState(
    profile?.studyPreferences || {
      preferredStudyTimes: [],
      studyMode: 'both',
      groupSize: '3-5',
      studyGoals: []
    }
  );
  const [profileCompletion, setProfileCompletion] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm({
    defaultValues: profile || {
      bio: '',
      availability: 'available',
      studyPreferences: studyPreferences,
      portfolioLinks: portfolioLinks,
    },
  });

  const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const availabilityOptions = ['available', 'busy', 'offline'];
  const studyModes = ['online', 'offline', 'both'];
  const groupSizes = ['1-2', '3-5', '6-10', '10+'];
  const studyTimeOptions = ['morning', 'afternoon', 'evening', 'night', 'weekend'];
  const studyGoalOptions = ['exam-prep', 'project-work', 'homework-help', 'skill-learning', 'research'];
  const portfolioTypes = ['github', 'portfolio', 'linkedin', 'website', 'other'];

  // Calculate profile completion score
  useEffect(() => {
    let completion = 0;
    const totalFields = 6;
    
    // Bio (20%)
    if (watch('bio') && watch('bio').length > 10) completion += 1;
    
    // Skills (20%)
    if (skills.filter(s => s.name.trim()).length >= 2) completion += 1;
    
    // Study preferences (20%)
    if (studyPreferences.preferredStudyTimes.length > 0) completion += 1;
    
    // Portfolio links (20%)
    if (portfolioLinks.filter(p => p.url.trim()).length >= 1) completion += 1;
    
    // Availability (10%)
    if (watch('availability')) completion += 0.5;
    
    // Study goals (10%)
    if (studyPreferences.studyGoals.length > 0) completion += 0.5;
    
    setProfileCompletion(Math.round((completion / totalFields) * 100));
  }, [watch, skills, studyPreferences, portfolioLinks]);

  const addSkill = () => {
    setSkills([...skills, { name: '', level: 'intermediate', category: '', verified: false }]);
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

  // Portfolio links management
  const addPortfolioLink = () => {
    setPortfolioLinks([...portfolioLinks, { title: '', url: '', type: 'github' }]);
  };

  const removePortfolioLink = (index) => {
    const newLinks = portfolioLinks.filter((_, i) => i !== index);
    setPortfolioLinks(newLinks);
  };

  const updatePortfolioLink = (index, field, value) => {
    const newLinks = [...portfolioLinks];
    newLinks[index][field] = value;
    setPortfolioLinks(newLinks);
  };

  // Study preferences management
  const toggleStudyTime = (time) => {
    const newTimes = studyPreferences.preferredStudyTimes.includes(time)
      ? studyPreferences.preferredStudyTimes.filter(t => t !== time)
      : [...studyPreferences.preferredStudyTimes, time];
    setStudyPreferences(prev => ({ ...prev, preferredStudyTimes: newTimes }));
  };

  const toggleStudyGoal = (goal) => {
    const newGoals = studyPreferences.studyGoals.includes(goal)
      ? studyPreferences.studyGoals.filter(g => g !== goal)
      : [...studyPreferences.studyGoals, goal];
    setStudyPreferences(prev => ({ ...prev, studyGoals: newGoals }));
  };

  const updateStudyPreference = (field, value) => {
    setStudyPreferences(prev => ({ ...prev, [field]: value }));
  };

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      skills: skills.filter(skill => skill.name.trim()),
      portfolioLinks: portfolioLinks.filter(link => link.url.trim()),
      studyPreferences,
      profileCompletion,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D3D3D]/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#eadfce] bg-[#fffaf4] shadow-[0_30px_80px_rgba(61,61,61,0.18)]">
        <div className="flex items-center justify-between border-b border-[#eadfce] bg-[linear-gradient(135deg,rgba(0,119,182,0.10),rgba(242,201,76,0.14))] p-6">
          <div>
            <h2 className="text-xl font-semibold text-[#3D3D3D]">
              {profile ? 'Edit Skill Profile' : 'Create Skill Profile'}
            </h2>
            {/* Profile Completion Score */}
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6f655c]">Profile Completion</span>
                <span className={`font-medium ${
                  profileCompletion >= 80 ? 'text-[#0077B6]' :
                  profileCompletion >= 60 ? 'text-[#8a6a10]' : 'text-[#b85f47]'
                }`}>
                  {profileCompletion}%
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-[#efe4d8]">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    profileCompletion >= 80 ? 'bg-[#0077B6]' :
                    profileCompletion >= 60 ? 'bg-[#F2C94C]' : 'bg-[#E07A5F]'
                  }`}
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-[#6f655c]">
                {profileCompletion >= 80 ? 'Excellent! Your profile is highly complete.' :
                 profileCompletion >= 60 ? 'Good progress! Add more details to improve visibility.' :
                 'Get started by adding your skills and preferences.'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-2 text-[#85786c] transition-colors hover:bg-white/70 hover:text-[#3D3D3D]"
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
                <span className="ml-2 text-xs text-[#85786c]">Add at least 2 skills for better matching</span>
              </label>
              <button
                type="button"
                onClick={addSkill}
                className="flex items-center rounded-full bg-[#d9ecf7] px-4 py-2 text-sm font-medium text-[#0b5f8f] transition-colors hover:bg-[#c9e2f1]"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </button>
            </div>
            
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-3 rounded-2xl border border-[#f0e1cf] bg-white/80 p-3">
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
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`verified-${index}`}
                      checked={skill.verified || false}
                      onChange={(e) => updateSkill(index, 'verified', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`verified-${index}`} className="text-xs text-gray-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </label>
                  </div>
                  {skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="rounded-full p-2 text-[#b85f47] transition-colors hover:bg-[#f6e3dc]"
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

          {/* Portfolio Links */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Portfolio & Links
                <span className="ml-2 text-xs text-[#85786c]">Showcase your work and profiles</span>
              </label>
              <button
                type="button"
                onClick={addPortfolioLink}
                className="flex items-center rounded-full bg-[#f6e3dc] px-4 py-2 text-sm font-medium text-[#b85f47] transition-colors hover:bg-[#efd3ca]"
              >
                <Link className="h-4 w-4 mr-1" />
                Add Link
              </button>
            </div>
            
            <div className="space-y-3">
              {portfolioLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-3 rounded-2xl border border-[#f0e1cf] bg-white/80 p-3">
                  <select
                    value={link.type}
                    onChange={(e) => updatePortfolioLink(index, 'type', e.target.value)}
                    className="form-input w-32"
                  >
                    {portfolioTypes.map(type => (
                      <option key={type} value={type} className="capitalize">
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Title (e.g., GitHub Profile)"
                      value={link.title}
                      onChange={(e) => updatePortfolioLink(index, 'title', e.target.value)}
                      className="form-input w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => updatePortfolioLink(index, 'url', e.target.value)}
                      className="form-input w-full"
                    />
                  </div>
                  {portfolioLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePortfolioLink(index)}
                      className="rounded-full p-2 text-[#b85f47] transition-colors hover:bg-[#f6e3dc]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {portfolioLinks.length === 0 && (
              <p className="py-4 text-center text-sm text-[#85786c]">
                Add portfolio links to showcase your work and increase profile visibility
              </p>
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
            <p className="mt-1 text-xs text-[#85786c]">
              {500 - (register('bio').value?.length || 0)} characters remaining
            </p>
          </div>

          {/* Study Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Study Preferences
              <span className="ml-2 text-xs text-[#85786c]">Help others find compatible study partners</span>
            </label>
            
            <div className="space-y-4">
              {/* Study Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Preferred Study Mode
                </label>
                <div className="flex space-x-4">
                  {studyModes.map(mode => (
                    <label key={mode} className="flex items-center">
                      <input
                        type="radio"
                        name="studyMode"
                        value={mode}
                        checked={studyPreferences.studyMode === mode}
                        onChange={() => updateStudyPreference('studyMode', mode)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Preferred Group Size
                </label>
                <select
                  value={studyPreferences.groupSize}
                  onChange={(e) => updateStudyPreference('groupSize', e.target.value)}
                  className="form-input w-full"
                >
                  {groupSizes.map(size => (
                    <option key={size} value={size}>{size} members</option>
                  ))}
                </select>
              </div>

              {/* Study Times */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Preferred Study Times
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {studyTimeOptions.map(time => (
                    <label key={time} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={studyPreferences.preferredStudyTimes.includes(time)}
                        onChange={() => toggleStudyTime(time)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Study Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="inline h-4 w-4 mr-1" />
                  Study Goals
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {studyGoalOptions.map(goal => (
                    <label key={goal} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={studyPreferences.studyGoals.includes(goal)}
                        onChange={() => toggleStudyGoal(goal)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {goal.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
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
