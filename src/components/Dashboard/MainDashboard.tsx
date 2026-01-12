'use client';

import { GlassCard, Logo } from '@/components/DesignSystem';
import { Users, Briefcase, Calendar, CheckSquare2, ArrowRight } from 'lucide-react';

interface MainDashboardProps {
  onSelectApp?: (app: string) => void;
}

export default function MainDashboard({ onSelectApp }: MainDashboardProps) {
  const stats = [
    { label: 'Active Candidates', value: '142', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Open Positions', value: '23', icon: Briefcase, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Interviews Today', value: '8', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Pending Tasks', value: '12', icon: CheckSquare2, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  const pipelineStages = [
    { stage: 'Applied', count: 45, color: 'bg-blue-500' },
    { stage: 'Screening', count: 32, color: 'bg-purple-500' },
    { stage: 'Interview', count: 28, color: 'bg-orange-500' },
    { stage: 'Offer', count: 12, color: 'bg-green-500' },
    { stage: 'Hired', count: 25, color: 'bg-emerald-500' },
  ];

  const recentJobs = [
    { id: 1, title: 'Senior Python Developer', candidates: 24, status: 'Active' },
    { id: 2, title: 'Full Stack Engineer', candidates: 18, status: 'Active' },
    { id: 3, title: 'Frontend Developer', candidates: 15, status: 'Active' },
  ];

  const upcomingInterviews = [
    { id: 1, candidate: 'John Smith', position: 'Senior Python Developer', time: '10:00 AM', type: 'Video' },
    { id: 2, candidate: 'Maria Garcia', position: 'Full Stack Engineer', time: '2:00 PM', type: 'In-person' },
    { id: 3, candidate: 'James Wilson', position: 'Backend Engineer', time: '4:30 PM', type: 'Video' },
  ];

  const tasks = [
    { id: 1, title: 'Review candidate profiles', priority: 'High', due: 'Today' },
    { id: 2, title: 'Schedule follow-up interviews', priority: 'Medium', due: 'Tomorrow' },
    { id: 3, title: 'Send offer letters', priority: 'High', due: 'Today' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <Logo size="lg" className="mb-2" />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          AI Recruiter Workbench
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <GlassCard key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent size={24} className={stat.color} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Candidate Pipeline */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Candidate Pipeline</h2>
            <button
              onClick={() => onSelectApp?.('candidates')}
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {pipelineStages.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{stage.stage}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{stage.count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Jobs */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Jobs</h2>
            <button
              onClick={() => onSelectApp?.('job-editor')}
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-colors">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{job.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{job.candidates} candidates</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">{job.status}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming Interviews */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Upcoming Interviews</h2>
            <button
              onClick={() => onSelectApp?.('scheduler')}
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              View Calendar <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="p-3 rounded-lg hover:bg-white/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{interview.candidate}</p>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{interview.time}</span>
                </div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{interview.position}</p>
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{interview.type}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Tasks */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Tasks</h2>
            <button 
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-colors">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Due: {task.due}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
