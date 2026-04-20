import React, { useLayoutEffect, useRef, useState } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { Plus, BookOpen, TrendingUp, BarChart3, Calendar, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import { useSubjects, useRecords, useProgressDashboard } from '../hooks/useAcademic';
import SubjectForm from '../components/SubjectForm';
import RecordForm from '../components/RecordForm';
import DashboardOverview from '../components/DashboardOverview';
import LoadingSpinner from '../../../components/LoadingSpinner';

const addUniqueRef = (collection, element) => {
  if (element && !collection.current.includes(element)) {
    collection.current.push(element);
  }
};

const Subjects = () => {
  const { subjects, loading, error, createSubject, updateSubject, deleteSubject } = useSubjects();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const actionButtonRefs = useRef([]);

  actionButtonRefs.current = [];

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
          ref={(element) => addUniqueRef(actionButtonRefs, element)}
          className="js-cta-button btn-primary flex items-center rounded-full bg-[#0f6c7a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,108,122,0.18)] transition-all duration-300 hover:bg-[#0c5965]"
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
              ref={(element) => addUniqueRef(actionButtonRefs, element)}
              className="js-cta-button inline-flex items-center rounded-full bg-[#0f6c7a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,108,122,0.18)] transition-all duration-300 hover:bg-[#0c5965]"
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
  const [isSubmittingRecord, setIsSubmittingRecord] = useState(false);
  const actionButtonRefs = useRef([]);

  actionButtonRefs.current = [];

  const handleCreateRecord = async (recordData) => {
    setIsSubmittingRecord(true);
    try {
      await createRecord(recordData);
      setShowForm(false);
      toast.success('Record added successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmittingRecord(false);
    }
  };

  const handleUpdateRecord = async (recordData) => {
    setIsSubmittingRecord(true);
    try {
      await updateRecord(editingRecord._id, recordData);
      setEditingRecord(null);
      toast.success('Record updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmittingRecord(false);
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

  const formatValue = (value, suffix = '') => (
    value !== undefined && value !== null && value !== '' ? `${value}${suffix}` : '-'
  );

  if (loading && records.length === 0) {
    return <LoadingSpinner text="Loading records..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Records</h1>
          <p className="text-gray-600 mt-1">Enter quiz, mid term, assignment, final marks, and attendance in one record</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          ref={(element) => addUniqueRef(actionButtonRefs, element)}
          className="js-cta-button flex items-center rounded-full bg-[#0f6c7a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,108,122,0.18)] transition-all duration-300 hover:bg-[#0c5965]"
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
                  Quiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mid Term
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Final
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
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
                    <div className={`text-sm font-medium ${getScoreColor(record.quizMarks || 0)}`}>
                      {formatValue(record.quizMarks)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getScoreColor(record.midtermMarks || 0)}`}>
                      {formatValue(record.midtermMarks)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getScoreColor(record.assignmentMarks || 0)}`}>
                      {formatValue(record.assignmentMarks)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getScoreColor(record.finalMarks || 0)}`}>
                      {formatValue(record.finalMarks)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getScoreColor(record.attendance || 0)}`}>
                      {formatValue(record.attendance, '%')}
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
                ref={(element) => addUniqueRef(actionButtonRefs, element)}
                className="js-cta-button inline-flex items-center rounded-full bg-[#0f6c7a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,108,122,0.18)] transition-all duration-300 hover:bg-[#0c5965]"
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
          loading={isSubmittingRecord}
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
  const location = useLocation();
  const pageRef = useRef(null);
  const navRef = useRef(null);
  const navButtonRefs = useRef([]);
  navButtonRefs.current = [];

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }
      );

      gsap.fromTo(
        navButtonRefs.current,
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.08 }
      );
    }, pageRef);

    return () => context.revert();
  }, [location.pathname]);

  useLayoutEffect(() => {
    const elements = [
      ...navButtonRefs.current,
      ...Array.from(pageRef.current?.querySelectorAll('.js-cta-button') || []),
    ];
    const cleanups = [];

    elements.forEach((element) => {
      if (!element) {
        return;
      }

      const onEnter = () => {
        gsap.to(element, {
          y: -3,
          scale: 1.02,
          boxShadow: '0 20px 38px rgba(61, 61, 61, 0.16)',
          duration: 0.22,
          ease: 'power2.out',
        });
      };

      const onLeave = () => {
        gsap.to(element, {
          y: 0,
          scale: 1,
          boxShadow: '0 10px 24px rgba(61, 61, 61, 0.08)',
          duration: 0.22,
          ease: 'power2.out',
        });
      };

      element.addEventListener('mouseenter', onEnter);
      element.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        element.removeEventListener('mouseenter', onEnter);
        element.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [location.pathname]);

  return (
    <div
      ref={pageRef}
      className="space-y-6 rounded-[32px] border border-[#e6dccf] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(249,244,235,0.92)_48%,rgba(240,247,246,0.88))] p-6 shadow-[0_28px_70px_rgba(61,61,61,0.08)]"
    >
      {/* Navigation Tabs */}
      <div className="rounded-[28px] border border-[#e6dccf] bg-white/80 p-3 shadow-[0_16px_40px_rgba(61,61,61,0.06)] backdrop-blur-sm">
        <nav ref={navRef} className="flex flex-wrap gap-3">
          <NavLink
            to="dashboard"
            ref={(element) => addUniqueRef(navButtonRefs, element)}
            className={({ isActive }) =>
              `inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-semibold shadow-[0_10px_24px_rgba(61,61,61,0.08)] transition-all duration-300 ${
                isActive
                  ? 'border-[#0f6c7a] bg-[#0f6c7a] text-white'
                  : 'border-[#d9cfbf] bg-white/90 text-[#5f5952] hover:border-[#0f6c7a]/30 hover:text-[#0f6c7a]'
              }`
            }
          >
            <BarChart3 className="inline w-4 h-4 mr-2" />
            Dashboard
          </NavLink>
          <NavLink
            to="subjects"
            ref={(element) => addUniqueRef(navButtonRefs, element)}
            className={({ isActive }) =>
              `inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-semibold shadow-[0_10px_24px_rgba(61,61,61,0.08)] transition-all duration-300 ${
                isActive
                  ? 'border-[#0f6c7a] bg-[#0f6c7a] text-white'
                  : 'border-[#d9cfbf] bg-white/90 text-[#5f5952] hover:border-[#0f6c7a]/30 hover:text-[#0f6c7a]'
              }`
            }
          >
            <BookOpen className="inline w-4 h-4 mr-2" />
            Subjects
          </NavLink>
          <NavLink
            to="records"
            ref={(element) => addUniqueRef(navButtonRefs, element)}
            className={({ isActive }) =>
              `inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-semibold shadow-[0_10px_24px_rgba(61,61,61,0.08)] transition-all duration-300 ${
                isActive
                  ? 'border-[#0f6c7a] bg-[#0f6c7a] text-white'
                  : 'border-[#d9cfbf] bg-white/90 text-[#5f5952] hover:border-[#0f6c7a]/30 hover:text-[#0f6c7a]'
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
