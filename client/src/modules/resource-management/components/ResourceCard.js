import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import resourceService from '../services/resourceService';
import { Star, ExternalLink, Download, Edit, Trash2, FileText, Link as LinkIcon, File } from 'lucide-react';

const ResourceCard = ({ resource, onEdit, onDelete, onRate, isOwner = false, canDelete = false }) => {
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id || null;
  const [hoveredStar, setHoveredStar] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const getEntityId = (entity) => {
    if (!entity) return null;
    if (typeof entity === 'string') return entity;
    return entity._id || entity.id || null;
  };

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
        return 'bg-[#d9ecf7] text-[#0b5f8f]';
      case 'link':
        return 'bg-[#d9f1ea] text-[#0c6e59]';
      case 'document':
        return 'bg-[#f6e3dc] text-[#b85f47]';
      default:
        return 'bg-[#efe4d8] text-[#62574d]';
    }
  };

  const handleRate = (rating) => {
    if (isOwner) return;

    onRate(resource._id, rating);
  };

  const openResource = () => {
    if (resource.type === 'link') {
      const url = resource.linkUrl;
      if (url) {
        window.open(url, '_blank');
      }
      return;
    }

    handleDownload();
  };

  const handleDownload = async () => {
    if (resource.type === 'link') return;

    setDownloading(true);
    try {
      const fileUrl = resource.fileUrl;
      const fileExtension = fileUrl ? fileUrl.split('.').pop() : 'pdf';
      const filename = `${resource.title}.${fileExtension}`;

      await resourceService.downloadResource(resource._id, filename);
    } catch (error) {
      console.error('Download error:', error);
      if (resource.fileUrl) {
        window.open(resource.fileUrl, '_blank');
      }
    } finally {
      setDownloading(false);
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

  const hasUserRated = resource.ratings?.some((rating) => getEntityId(rating.user) === currentUserId);
  const userCurrentRating = resource.ratings?.find((rating) => getEntityId(rating.user) === currentUserId)?.rating || 0;

  return (
    <div className="card-hover rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(253,246,236,0.92))] p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
              {getTypeIcon(resource.type)}
              <span className="ml-1 capitalize">{resource.type}</span>
            </span>
            <span className="text-xs text-[#85786c]">{resource.subject}</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[#3D3D3D]">{resource.title}</h3>
          {resource.description && (
            <p className="line-clamp-3 text-sm text-[#62574d]">{resource.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {(isOwner || canDelete) && (
            <>
              {isOwner && (
              <button
                onClick={handleEdit}
                className="rounded-full p-2 text-[#0077B6] transition-colors hover:bg-[#d9ecf7]"
                title="Edit resource"
              >
                <Edit className="h-4 w-4" />
              </button>
              )}
              <button
                onClick={handleDelete}
                className="rounded-full p-2 text-[#E07A5F] transition-colors hover:bg-[#f6e3dc]"
                title="Delete resource"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
          {!isOwner && !canDelete && (
            <span className="text-xs font-medium text-[#b7ab9e]">View only</span>
          )}
        </div>
      </div>

      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-[#efe4d8] px-2 py-1 text-xs font-medium text-[#62574d]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-current text-[#F2C94C]" />
            <span className="ml-1 text-sm font-medium text-[#3D3D3D]">
              {resource.averageRating.toFixed(1)}
            </span>
            <span className="ml-1 text-xs text-[#85786c]">
              ({resource.ratings?.length || 0} reviews)
            </span>
          </div>
        </div>

        {!isOwner && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-[#85786c]">Rate:</span>
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
                      : 'text-[#d7c8b7]'
                  } ${hasUserRated ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-[#F2C94C]'}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#eadfce] pt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={openResource}
            disabled={downloading}
            className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
              downloading
                ? 'cursor-not-allowed text-[#b7ab9e]'
                : resource.type === 'link'
                  ? 'text-[#0077B6] hover:bg-[#d9ecf7]'
                  : 'text-[#0c6e59] hover:bg-[#d9f1ea]'
            }`}
          >
            {downloading ? (
              <>
                <div className="loading-spinner w-4 h-4 mr-1"></div>
                Downloading...
              </>
            ) : resource.type === 'link' ? (
              <>
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Link
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" />
                Download File
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-[#85786c]">
          Uploaded {new Date(resource.createdAt).toLocaleDateString()}
          {resource.downloads && (
            <span className="ml-2">&bull; {resource.downloads} downloads</span>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-[#eadfce] pt-4">
        <div className="flex items-center">
          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0077B6,#4f9fc6)] text-xs font-medium text-white">
            {resource.uploadedBy?.firstName?.[0] || resource.uploadedBy?.username?.[0]?.toUpperCase()}
          </div>
          <p className="text-xs text-[#85786c]">
            by {resource.uploadedBy?.firstName} {resource.uploadedBy?.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
