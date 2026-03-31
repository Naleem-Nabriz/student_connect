import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Star, ExternalLink, Download, Edit, Trash2, FileText, Link as LinkIcon, File } from 'lucide-react';

const ResourceCard = ({ resource, onEdit, onDelete, onRate, isOwner = false }) => {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'file':
        return <File className="h-5 w-5" />;
      case 'link':
        return <LinkIcon className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'file':
        return 'bg-blue-100 text-blue-800';
      case 'link':
        return 'bg-green-100 text-green-800';
      case 'document':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRate = (rating) => {
    if (isOwner) return; // Owner cannot rate their own resource
    
    setUserRating(rating);
    onRate(resource._id, rating);
  };

  const openResource = () => {
    const url = resource.type === 'link' ? resource.linkUrl : resource.fileUrl;
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleEdit = () => {
    onEdit(resource);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      onDelete(resource._id);
    }
  };

  const hasUserRated = resource.ratings?.some(r => r.user._id === user?.id);
  const userCurrentRating = resource.ratings?.find(r => r.user._id === user?.id)?.rating || 0;

  return (
    <div className="card-hover bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
              {getTypeIcon(resource.type)}
              <span className="ml-1 capitalize">{resource.type}</span>
            </span>
            <span className="text-xs text-gray-500">{resource.subject}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
          {resource.description && (
            <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isOwner && (
            <>
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit resource"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete resource"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Rating Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900">
              {resource.averageRating.toFixed(1)}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({resource.ratings?.length || 0} reviews)
            </span>
          </div>
        </div>
        
        {!isOwner && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Rate:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-1 transition-colors"
                disabled={hasUserRated}
              >
                <Star
                  className={`h-4 w-4 ${
                    star <= (hoveredStar || userCurrentRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  } ${hasUserRated ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-yellow-400'}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <button
            onClick={openResource}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            {resource.type === 'link' ? (
              <>
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Link
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" />
                View Resource
              </>
            )}
          </button>
        </div>
        
        <div className="text-xs text-gray-400">
          Uploaded {new Date(resource.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Uploaded by info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium mr-2">
            {resource.uploadedBy?.firstName?.[0] || resource.uploadedBy?.username?.[0]?.toUpperCase()}
          </div>
          <p className="text-xs text-gray-500">
            by {resource.uploadedBy?.firstName} {resource.uploadedBy?.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
