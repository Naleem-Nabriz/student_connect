import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Plus, BookOpen, TrendingUp, BarChart3, Calendar, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSubjects, useRecords, useProgressDashboard } from '../hooks/useAcademic';
import SubjectForm from '../components/SubjectForm';
import RecordForm from '../components/RecordForm';
import DashboardOverview from '../components/DashboardOverview';
import LoadingSpinner from '../../../components/LoadingSpinner';

const Subjects = () => {
  const { subjects, loading, error, createSubject, updateSubject, deleteSubject } = useSubjects();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const handleCreateSubject = async (subjectData) => {
    try {
      await createSubject(subjectData);
      setShowForm(false);
      toast.success('Subject added successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateSubject = async (subjectData) => {
    try {
      await updateSubject(editingSubject._id, subjectData);
      setEditingSubject(null);
      toast.success('Subject updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject? All associated records will also be deleted.')) {
      try {
        await deleteSubject(id);
        toast.success('Subject deleted successfully!');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (loading && subjects.length === 0) {
    return <LoadingSpinner text="Loading subjects..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600 mt-1">Manage your academic subjects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {subjects.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Goals
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{subject.code || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{subject.credits || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{subject.semester || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Marks: {subject.targetMarks ?? '-'}</div>
                      <div>Attendance: {subject.targetAttendance ? `${subject.targetAttendance}%` : '-'}</div>
                      <div>Study Hours: {subject.weeklyStudyHours ?? '-'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingSubject(subject)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects yet</h3>
          <p className="mt-1 text-sm text-gray-500">Add your first subject to start tracking your progress</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </button>
          </div>
        </div>
      )}

      {(showForm || editingSubject) && (
        <SubjectForm
          subject={editingSubject}
          onSubmit={editingSubject ? handleUpdateSubject : handleCreateSubject}
          onCancel={() => {
            setShowForm(false);
            setEditingSubject(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

const Records = () => {
  const { subjects } = useSubjects();
  const { records, loading, error, createRecord, updateRecord, deleteRecord } = useRecords();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filterSubject, setFilterSubject] = useState('');

  const handleCreateRecord = async (recordData) => {
    try {
      await createRecord(recordData);
      setShowForm(false);
      toast.success('Record added successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateRecord = async (recordData) => {
    try {
      await updateRecord(editingRecord._id, recordData);
      setEditingRecord(null);
      toast.success('Record updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(id);
        toast.success('Record deleted successfully!');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const filteredRecords = filterSubject
    ? records.filter(record => record.subjectId._id === filterSubject)
    : records;

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading && records.length === 0) {
    return <LoadingSpinner text="Loading records..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Records</h1>
          <p className="text-gray-600 mt-1">Track your marks, attendance, and assignments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="form-input"
        >
          <option value="">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {filteredRecords.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {record.subjectId.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {record.testType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getScoreColor(record.marks || 0)}`}>
                      {record.marks || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getScoreColor(record.attendance || 0)}`}>
                      {record.attendance || '-'}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getScoreColor(record.assignmentScore || 0)}`}>
                      {record.assignmentScore || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingRecord(record)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No records yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            {subjects.length === 0 
              ? 'Add subjects first to start tracking records'
              : 'Add your first academic record to track your progress'
            }
          </p>
          {subjects.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </button>
            </div>
          )}
        </div>
      )}

      {(showForm || editingRecord) && (
        <RecordForm
          record={editingRecord}
          subjects={subjects}
          onSubmit={editingRecord ? handleUpdateRecord : handleCreateRecord}
          onCancel={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

const Dashboard = () => {
  const { dashboardData, loading, error } = useProgressDashboard();

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return <DashboardOverview data={dashboardData} />;
};

const AcademicProgress = () => {
  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `py-2 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            <BarChart3 className="inline w-4 h-4 mr-2" />
            Dashboard
          </NavLink>
          <NavLink
            to="subjects"
            className={({ isActive }) =>
              `py-2 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            <BookOpen className="inline w-4 h-4 mr-2" />
            Subjects
          </NavLink>
          <NavLink
            to="records"
            className={({ isActive }) =>
              `py-2 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            <TrendingUp className="inline w-4 h-4 mr-2" />
            Records
          </NavLink>
        </nav>
      </div>

      {/* Tab Content */}
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="records" element={<Records />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default AcademicProgress;
