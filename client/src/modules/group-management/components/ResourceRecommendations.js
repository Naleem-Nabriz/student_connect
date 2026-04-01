import React, { useState, useEffect } from 'react';
import { Link, BookOpen, ExternalLink, Star, Users, Clock, Tag } from 'lucide-react';
import { resourceRecommendationService } from '../../../services/resourceRecommendationService';

const ResourceRecommendations = ({ groupData, onResourceSelect, className = '' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (groupData && groupData.subject) {
      fetchRecommendations();
    }
  }, [groupData]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const recommendedResources = await resourceRecommendationService.getRecommendedResources(groupData);
      setRecommendations(recommendedResources);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceClick = (resource) => {
    if (onResourceSelect) {
      onResourceSelect(resource);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'link':
        return <ExternalLink className="h-4 w-4" />;
      case 'file':
        return <BookOpen className="h-4 w-4" />;
      case 'document':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'link':
        return 'text-blue-600 bg-blue-100';
      case 'file':
        return 'text-green-600 bg-green-100';
      case 'document':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>{error}</p>
          <button
            onClick={fetchRecommendations}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Resources</h3>
        <div className="text-center text-gray-500 py-8">
          <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No resources found for "{groupData?.subject}"</p>
          <p className="text-sm mt-1">Try adding some resources to the platform!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recommended Resources
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <Star className="h-4 w-4 mr-1 text-yellow-500" />
          AI-powered suggestions
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((resource, index) => (
          <div
            key={resource._id || index}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => handleResourceClick(resource)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                    {getResourceIcon(resource.type)}
                    <span className="ml-1 capitalize">{resource.type}</span>
                  </span>
                  {resource.score && (
                    <span className="text-xs text-gray-500">
                      {Math.round(resource.score)}% match
                    </span>
                  )}
                </div>
                
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {resource.title}
                </h4>
                
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {resource.description || 'No description available'}
                </p>

                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {resource.subject}
                  </span>
                  {resource.tags && resource.tags.length > 0 && (
                    <span className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {resource.tags.slice(0, 2).join(', ')}
                      {resource.tags.length > 2 && '...'}
                    </span>
                  )}
                  {resource.createdAt && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-4 flex-shrink-0">
                {resource.type === 'link' ? (
                  <a
                    href={resource.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                ) : (
                  <div className="text-gray-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => window.location.href = '/resources'}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all resources →
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceRecommendations;
