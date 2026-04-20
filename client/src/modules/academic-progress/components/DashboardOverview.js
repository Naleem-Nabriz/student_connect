import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, BookOpen, Target, Award, BarChart3, Calendar, AlertTriangle, BrainCircuit, Clock3 } from 'lucide-react';

const addUniqueRef = (collection, element) => {
  if (element && !collection.current.includes(element)) {
    collection.current.push(element);
  }
};

const DashboardOverview = ({ data }) => {
  const containerRef = useRef(null);
  const statCardRefs = useRef([]);
  const panelRefs = useRef([]);
  const subjectRowRefs = useRef([]);
  const detailCardRefs = useRef([]);

  statCardRefs.current = [];
  panelRefs.current = [];
  subjectRowRefs.current = [];
  detailCardRefs.current = [];

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        statCardRefs.current,
        { autoAlpha: 0, y: 26, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out' }
      );

      gsap.fromTo(
        panelRefs.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.1, ease: 'power3.out', delay: 0.12 }
      );

      gsap.fromTo(
        subjectRowRefs.current,
        { autoAlpha: 0, x: -18 },
        { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', delay: 0.2 }
      );
    }, containerRef);

    return () => context.revert();
  }, [data]);

  useLayoutEffect(() => {
    const interactiveCards = [
      ...statCardRefs.current,
      ...panelRefs.current,
      ...subjectRowRefs.current,
      ...detailCardRefs.current,
    ];
    const cleanups = [];

    interactiveCards.forEach((element) => {
      if (!element) {
        return;
      }

      const onEnter = () => {
        gsap.to(element, {
          y: -4,
          scale: 1.01,
          boxShadow: '0 24px 44px rgba(44, 62, 80, 0.12)',
          duration: 0.22,
          ease: 'power2.out',
        });
      };

      const onLeave = () => {
        gsap.to(element, {
          y: 0,
          scale: 1,
          boxShadow: '0 14px 32px rgba(44, 62, 80, 0.08)',
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
  }, [data]);

  if (!data) {
    return (
      <div className="py-12 text-center">
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
    <div ref={containerRef} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div ref={(element) => addUniqueRef(statCardRefs, element)} className="rounded-[26px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subjects</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{overallStats.totalSubjects}</p>
            </div>
            <div className="rounded-full bg-[#dceef4] p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div ref={(element) => addUniqueRef(statCardRefs, element)} className="rounded-[26px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{overallStats.totalRecords}</p>
            </div>
            <div className="rounded-full bg-[#efe3fa] p-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div ref={(element) => addUniqueRef(statCardRefs, element)} className="rounded-[26px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Marks</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {overallStats.overallAverage ? overallStats.overallAverage.toFixed(1) : 'N/A'}
              </p>
            </div>
            <div className="rounded-full bg-[#def3e4] p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div ref={(element) => addUniqueRef(statCardRefs, element)} className="rounded-[26px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {overallStats.overallAttendance ? `${overallStats.overallAttendance.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <div className="rounded-full bg-[#f9e7d4] p-3">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div ref={(element) => addUniqueRef(statCardRefs, element)} className="rounded-[26px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Subjects</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{overallStats.atRiskSubjects || 0}</p>
            </div>
            <div className="rounded-full bg-[#fde2df] p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div ref={(element) => addUniqueRef(statCardRefs, element)} className="rounded-[26px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Watchlist Subjects</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">{overallStats.mediumRiskSubjects || 0}</p>
            </div>
            <div className="rounded-full bg-[#fbefcb] p-3">
              <BrainCircuit className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div ref={(element) => addUniqueRef(statCardRefs, element)} className="rounded-[26px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planned Study Hours</p>
              <p className="mt-1 text-2xl font-bold text-indigo-600">{overallStats.recommendedStudyHours || 0}</p>
            </div>
            <div className="rounded-full bg-[#e4e8ff] p-3">
              <Clock3 className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      <div ref={(element) => addUniqueRef(panelRefs, element)} className="rounded-[28px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Subject Performance</h2>

        {subjectStats.length > 0 ? (
          <div className="space-y-4">
            {subjectStats.map((subject, index) => (
              <div
                key={index}
                ref={(element) => addUniqueRef(subjectRowRefs, element)}
                className="flex items-center justify-between rounded-[22px] border border-[#ebe4d9] bg-[linear-gradient(135deg,#ffffff,#f7f4ef)] p-4 shadow-[0_14px_32px_rgba(44,62,80,0.08)]"
              >
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
                    <p className="text-sm font-bold text-gray-900">{subject.averageAttendance}%</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">Assignment</p>
                    <p className="text-sm font-bold text-gray-900">{subject.averageAssignmentScore}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">Grade</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getGradeColor(parseFloat(subject.averageMarks))}`}>
                      {getGrade(parseFloat(subject.averageMarks))}
                    </span>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">Records</p>
                    <p className="text-sm font-bold text-gray-900">{subject.totalRecords}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">Risk</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
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
          <div className="py-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No subject data</h3>
            <p className="mt-1 text-sm text-gray-500">Add subjects and records to see performance</p>
          </div>
        )}
      </div>

      {subjectStats.length > 0 && (
        <div ref={(element) => addUniqueRef(panelRefs, element)} className="rounded-[28px] border border-[#d7e7ea] bg-[linear-gradient(135deg,#eef7f6,#f7f4ff)] p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)]">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance Insights</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div ref={(element) => addUniqueRef(detailCardRefs, element)} className="rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_14px_32px_rgba(44,62,80,0.08)]">
              <h4 className="mb-2 text-sm font-medium text-gray-900">Top Performing Subject</h4>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  {coachingSummary?.strongestSubject?.name}
                </span>
                <span className="text-sm text-gray-500">
                  {coachingSummary?.strongestSubject?.averageMarks?.toFixed(1)}%
                </span>
              </div>
            </div>

            <div ref={(element) => addUniqueRef(detailCardRefs, element)} className="rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_14px_32px_rgba(44,62,80,0.08)]">
              <h4 className="mb-2 text-sm font-medium text-gray-900">Needs Improvement</h4>
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div ref={(element) => addUniqueRef(panelRefs, element)} className="rounded-[28px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Risk Alerts</h3>
          </div>
          {riskAlerts.length > 0 ? (
            <div className="space-y-3">
              {riskAlerts.map((alert, index) => (
                <div
                  key={`${alert.subjectId}-${index}`}
                  ref={(element) => addUniqueRef(detailCardRefs, element)}
                  className={`rounded-[20px] border p-4 shadow-[0_14px_32px_rgba(44,62,80,0.08)] ${
                    alert.severity === 'high'
                      ? 'border-red-200 bg-red-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
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

        <div ref={(element) => addUniqueRef(panelRefs, element)} className="rounded-[28px] border border-[#e3ded3] bg-white/92 p-6 shadow-[0_14px_32px_rgba(44,62,80,0.08)] backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
          </div>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div
                  key={`${recommendation.subjectId}-${index}`}
                  ref={(element) => addUniqueRef(detailCardRefs, element)}
                  className="rounded-[20px] border border-indigo-100 bg-indigo-50 p-4 shadow-[0_14px_32px_rgba(44,62,80,0.08)]"
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
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
