import React from 'react';
import { TrendingUp, BookOpen, Target, Award, BarChart3, Calendar, AlertTriangle, BrainCircuit, Clock3 } from 'lucide-react';

const DashboardOverview = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p className="mt-1 text-sm text-gray-500">Add subjects and records to see your progress</p>
      </div>
    );
  }

  const { subjectStats, overallStats, riskAlerts = [], recommendations = [], coachingSummary } = data;

  const getGradeColor = (average) => {
    if (average >= 90) return 'text-green-600 bg-green-50';
    if (average >= 80) return 'text-blue-600 bg-blue-50';
    if (average >= 70) return 'text-yellow-600 bg-yellow-50';
    if (average >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getGrade = (average) => {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
  };

  const getPerformanceIcon = (average) => {
    if (average >= 85) return <Award className="h-5 w-5 text-green-600" />;
    if (average >= 75) return <TrendingUp className="h-5 w-5 text-blue-600" />;
    if (average >= 65) return <Target className="h-5 w-5 text-yellow-600" />;
    return <TrendingUp className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{overallStats.totalSubjects}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{overallStats.totalRecords}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Marks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {overallStats.overallAverage ? overallStats.overallAverage.toFixed(1) : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {overallStats.overallAttendance ? overallStats.overallAttendance.toFixed(1) + '%' : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Subjects</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{overallStats.atRiskSubjects || 0}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Watchlist Subjects</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{overallStats.mediumRiskSubjects || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <BrainCircuit className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planned Study Hours</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{overallStats.recommendedStudyHours || 0}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Clock3 className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h2>
        
        {subjectStats.length > 0 ? (
          <div className="space-y-4">
            {subjectStats.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getPerformanceIcon(parseFloat(subject.averageMarks))}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{subject.subject.name}</h3>
                    <p className="text-xs text-gray-500">
                      {subject.subject.code} • {subject.subject.credits || 'N/A'} credits
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Avg Marks</p>
                    <p className={`text-sm font-bold ${getGradeColor(parseFloat(subject.averageMarks)).split(' ')[0]}`}>
                      {subject.averageMarks}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Attendance</p>
                    <p className="text-sm font-bold text-gray-900">
                      {subject.averageAttendance}%
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Assignment</p>
                    <p className="text-sm font-bold text-gray-900">
                      {subject.averageAssignmentScore}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Grade</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(parseFloat(subject.averageMarks))}`}>
                      {getGrade(parseFloat(subject.averageMarks))}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Records</p>
                    <p className="text-sm font-bold text-gray-900">{subject.totalRecords}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">Risk</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      subject.riskLevel === 'high'
                        ? 'bg-red-100 text-red-700'
                        : subject.riskLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}>
                      {subject.riskLevel}
                    </span>
                  </div>
                </div>

                {(subject.goals.targetMarks || subject.goals.targetAttendance || subject.goals.weeklyStudyHours) && (
                  <div className="ml-6 text-xs text-gray-500">
                    Goals:
                    {subject.goals.targetMarks ? ` Marks ${subject.goals.targetMarks}` : ''}
                    {subject.goals.targetAttendance ? ` | Attendance ${subject.goals.targetAttendance}%` : ''}
                    {subject.goals.weeklyStudyHours ? ` | Study ${subject.goals.weeklyStudyHours} hrs/week` : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No subject data</h3>
            <p className="mt-1 text-sm text-gray-500">Add subjects and records to see performance</p>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      {subjectStats.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Top Performing Subject</h4>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  {coachingSummary?.strongestSubject?.name}
                </span>
                <span className="text-sm text-gray-500">
                  {coachingSummary?.strongestSubject?.averageMarks?.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Needs Improvement</h4>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-orange-600">
                  {coachingSummary?.weakestSubject?.name}
                </span>
                <span className="text-sm text-gray-500">
                  {coachingSummary?.weakestSubject?.averageMarks?.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Risk Alerts</h3>
          </div>
          {riskAlerts.length > 0 ? (
            <div className="space-y-3">
              {riskAlerts.map((alert, index) => (
                <div key={`${alert.subjectId}-${index}`} className={`rounded-lg border p-4 ${
                  alert.severity === 'high'
                    ? 'border-red-200 bg-red-50'
                    : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">{alert.subjectName}</span>
                    <span className={`text-xs font-medium uppercase ${
                      alert.severity === 'high' ? 'text-red-600' : 'text-yellow-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No active academic risk alerts right now.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
          </div>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={`${recommendation.subjectId}-${index}`} className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
                    {recommendation.subjectName}
                  </p>
                  <p className="text-sm text-gray-700">{recommendation.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Add more records to unlock tailored recommendations.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
