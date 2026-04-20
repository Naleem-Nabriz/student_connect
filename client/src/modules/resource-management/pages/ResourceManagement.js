import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResources } from '../hooks/useResources';
import { useAuth } from '../../../context/AuthContext';
import ResourceCard from '../components/ResourceCard';
import ResourceForm from '../components/ResourceForm';
import LoadingSpinner from '../../../components/LoadingSpinner';

const ResourceList = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id || null;
  const isAdmin = user?.role === 'admin';
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  
  const {
    resources,
    loading,
    error,
    createResource,
    updateResource,
    deleteResource,
    rateResource,
  } = useResources();

  const handleCreateResource = async (resourceData, isFileUpload = false) => {
    try {
      await createResource(resourceData, isFileUpload);
      setShowForm(false);
      toast.success('Resource shared successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateResource = async (resourceData) => {
    try {
      await updateResource(editingResource._id, resourceData);
      setEditingResource(null);
      toast.success('Resource updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      await deleteResource(id);
      toast.success('Resource deleted successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRateResource = async (id, rating) => {
    try {
      await rateResource(id, rating);
      toast.success('Rating submitted successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredAndSortedResources = resources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSubject = !filterSubject || resource.subject.toLowerCase() === filterSubject.toLowerCase();
      const matchesType = !filterType || resource.type === filterType;
      return matchesSearch && matchesSubject && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const subjects = [...new Set(resources.map(resource => resource.subject))];
  const types = ['link', 'file', 'document'];

  if (loading && resources.length === 0) {
    return <LoadingSpinner text="Loading resources..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Library</h1>
          <p className="text-gray-600 mt-1">Share and discover learning resources</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Share Resource
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="form-input"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-input"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type} className="capitalize">{type}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              <option value="createdAt">Latest First</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title A-Z</option>
              <option value="subject">Subject A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Resources Grid */}
      {filteredAndSortedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              onEdit={setEditingResource}
              onDelete={handleDeleteResource}
              onRate={handleRateResource}
              isOwner={getEntityId(resource.uploadedBy) === currentUserId}
              canDelete={getEntityId(resource.uploadedBy) === currentUserId || isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Plus className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterSubject || filterType
              ? 'Try adjusting your search or filters'
              : 'Get started by sharing your first resource'}
          </p>
          {!searchTerm && !filterSubject && !filterType && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Share Resource
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Resource Modal */}
      {(showForm || editingResource) && (
        <ResourceForm
          resource={editingResource}
          onSubmit={editingResource ? handleUpdateResource : handleCreateResource}
          onCancel={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

const ResourceManagement = () => {
  return (
    <Routes>
      <Route path="/" element={<ResourceList />} />
    </Routes>
  );
};

export default ResourceManagement;
  const getEntityId = (entity) => {
    if (!entity) return null;
    if (typeof entity === 'string') return entity;
    return entity._id || entity.id || null;
  };
