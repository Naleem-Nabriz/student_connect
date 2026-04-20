import React, { useState } from 'react';
import { Calendar, Clock, Flag, Tag, CheckCircle, XCircle, AlertCircle, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onEdit, onDelete, onUpdate }) => {
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-[#0b5f8f] bg-[#d9ecf7]';
      case 'overdue': return 'text-[#b85f47] bg-[#f6e3dc]';
      case 'postponed': return 'text-[#8a6a10] bg-[#fff1cc]';
      default: return 'text-[#62574d] bg-[#efe4d8]';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-[#E07A5F]';
      case 'medium': return 'text-[#8a6a10]';
      case 'low': return 'text-[#0077B6]';
      default: return 'text-[#62574d]';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'overdue': return <AlertCircle className="h-5 w-5" />;
      case 'postponed': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await taskService.completeTask(task._id, {
        mood: 'medium',
        energy: 'medium',
        studyHours: 1
      });
      toast.success('Task completed successfully!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  const handlePostpone = async () => {
    const newDeadline = prompt('Enter new deadline (YYYY-MM-DD HH:MM):');
    if (!newDeadline) return;

    setLoading(true);
    try {
      await taskService.postponeTask(task._id, {
        newDeadline,
        reason: 'Postponed by user'
      });
      toast.success('Task postponed successfully!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to postpone task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    try {
      await taskService.deleteTask(task._id);
      toast.success('Task deleted successfully!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = new Date(task.deadline) < new Date() && task.status === 'pending';

  return (
    <div className="rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(253,246,236,0.92))] p-4 shadow-[0_18px_45px_rgba(61,61,61,0.08)] transition-shadow hover:shadow-[0_22px_55px_rgba(61,61,61,0.12)]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
              <span className="ml-1 capitalize">{task.status}</span>
            </span>
            <span className={`inline-flex items-center text-xs font-medium ${getPriorityColor(task.priority)}`}>
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </span>
            {task.category && (
              <span className="inline-flex items-center text-xs text-[#85786c]">
                <Tag className="h-3 w-3 mr-1" />
                {task.category}
              </span>
            )}
          </div>
          
          <h3 className="mb-1 text-lg font-medium text-[#3D3D3D]">{task.title}</h3>
          
          {task.description && (
            <p className="mb-2 line-clamp-2 text-sm text-[#62574d]">{task.description}</p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="rounded-full p-1 text-[#85786c] transition-colors hover:bg-[#efe4d8] hover:text-[#3D3D3D]"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {showActions && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-2xl border border-[#eadfce] bg-white shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => { onEdit(task); setShowActions(false); }}
                  className="block w-full px-4 py-2 text-left text-sm text-[#62574d] hover:bg-[#fff7ed]"
                >
                  Edit
                </button>
                {task.status === 'pending' && (
                  <>
                    <button
                      onClick={handleComplete}
                      disabled={loading}
                      className="block w-full px-4 py-2 text-left text-sm text-[#0077B6] hover:bg-[#d9ecf7]"
                    >
                      {loading ? 'Completing...' : 'Complete'}
                    </button>
                    <button
                      onClick={handlePostpone}
                      disabled={loading}
                      className="block w-full px-4 py-2 text-left text-sm text-[#8a6a10] hover:bg-[#fff1cc]"
                    >
                      {loading ? 'Postponing...' : 'Postpone'}
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="block w-full px-4 py-2 text-left text-sm text-[#E07A5F] hover:bg-[#f6e3dc]"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[#85786c]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span className={isOverdue ? 'font-medium text-[#E07A5F]' : ''}>
              {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
          {task.studySessionDate && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{format(new Date(task.studySessionDate), 'MMM dd, HH:mm')}</span>
            </div>
          )}
        </div>
        
        {task.reminderRules && task.reminderRules.length > 0 && (
          <div className="text-xs text-[#85786c]">
            {task.reminderRules.length} reminder{task.reminderRules.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {task.feedback && (
        <div className="mt-3 border-t border-[#eadfce] pt-3">
          <div className="flex items-center space-x-4 text-xs text-[#85786c]">
            {task.feedback.mood && (
              <span>Mood: {task.feedback.mood}</span>
            )}
            {task.feedback.energy && (
              <span>Energy: {task.feedback.energy}</span>
            )}
            {task.feedback.studyHours && (
              <span>Study hours: {task.feedback.studyHours}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
