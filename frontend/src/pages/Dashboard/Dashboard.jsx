import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, CheckCircle, Clock, Cpu, MapPin, Tag, Search, PlusCircle, FolderHeart, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';
import Badge from '../../components/common/Badge';
import ErrorState from '../../components/common/ErrorState';
import { StatSkeleton } from '../../components/common/LoadingSkeleton';

const PIE_COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Mock user data for personalized experience
  const user = {
    name: 'Alex',
    myLost: 1,
    myFound: 2,
    myMatches: 2,
    myRecovered: 1,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchDashboard = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await api.getDashboard();
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <ErrorState
          title="Dashboard unavailable"
          description="We couldn't load the dashboard data. Please try again."
          onRetry={fetchDashboard}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      {/* Personalized Greeting */}
      <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-1">
            {getGreeting()}, {user.name}
          </h1>
          <p className="text-sm text-text-secondary">
            You have <span className="font-semibold text-primary">{user.myMatches} new AI match suggestions</span> waiting for review.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/matches" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light/50 text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-medium transition-colors">
            <Bell className="w-4 h-4" />
            View Matches
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
      >
        <Link to="/report-lost" className="flex flex-col items-center justify-center gap-3 p-5 bg-surface border border-border rounded-2xl hover:border-primary hover:shadow-sm transition-all group">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-text text-center">Report Lost</span>
        </Link>
        <Link to="/report-found" className="flex flex-col items-center justify-center gap-3 p-5 bg-surface border border-border rounded-2xl hover:border-primary hover:shadow-sm transition-all group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-text text-center">Report Found</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center justify-center gap-3 p-5 bg-surface border border-border rounded-2xl hover:border-primary hover:shadow-sm transition-all group">
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform dark:bg-gray-800 dark:text-gray-300">
            <FolderHeart className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-text text-center">Search Items</span>
        </Link>
        <Link to="/matches" className="flex flex-col items-center justify-center gap-3 p-5 bg-surface border border-border rounded-2xl hover:border-primary hover:shadow-sm transition-all group">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-text text-center">AI Matches</span>
        </Link>
      </motion.div>

      <div className="mb-6 mt-12 flex items-center gap-2">
        <Activity className="w-5 h-5 text-text-secondary" />
        <h2 className="text-xl font-semibold text-text">My Activity</h2>
      </div>

      {/* Personal Stats row */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          <StatCard label="My Lost Reports" value={user.myLost} icon={Search} />
          <StatCard label="My Found Reports" value={user.myFound} icon={PlusCircle} />
          <StatCard label="My Matches" value={user.myMatches} icon={Cpu} />
          <StatCard label="Recovered" value={user.myRecovered} icon={CheckCircle} accent />
        </motion.div>
      )}

      {/* Recent Personal Activity & AI Matches */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-12">
          {/* Recent Reports List */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-surface border border-border rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text">Recent Activity</h3>
              <Link to="/search" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                View history
              </Link>
            </div>
            <div className="divide-y divide-border-light">
              {data.recentReports.slice(0, 4).map((report) => (
                <div key={report.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">{report.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-text-tertiary flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {report.location}
                      </span>
                      <span className="text-xs text-text-tertiary">{report.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant={report.type === 'lost' ? 'lost' : 'found'}>
                      {report.type}
                    </Badge>
                    <Badge variant={
                      report.status === 'recovered' ? 'success' :
                      report.status === 'matched' ? 'primary' :
                      'default'
                    }>
                      {report.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Featured AI Match */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-surface border border-border rounded-2xl p-4 sm:p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" /> Top AI Match
              </h3>
            </div>
            
            <div className="flex-grow flex flex-col justify-center bg-primary-light/30 rounded-xl p-4 border border-primary-light">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="primary">92% Match</Badge>
                <span className="text-xs text-text-tertiary">Just now</span>
              </div>
              <p className="text-sm font-medium text-text mb-1">Black Casio Calculator</p>
              <p className="text-xs text-text-secondary mb-4 line-clamp-2">Found matching brand and color in Library 2nd Floor.</p>
              <Link to="/matches" className="mt-auto w-full text-center py-2 bg-surface dark:bg-surface border border-border rounded-lg text-sm font-medium text-text hover:bg-border-light transition-colors">
                Review Match
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border w-full mb-12"></div>

      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-text">Campus Insights</h2>
        <p className="text-sm text-text-secondary">Overview of global campus lost and found activity.</p>
      </div>

      {/* Global Charts */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-surface border border-border rounded-2xl p-4 sm:p-5"
          >
            <h3 className="text-sm font-semibold text-text mb-4">Weekly Campus Activity</h3>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-base)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary-base)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary-base)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid var(--color-border-base)',
                      backgroundColor: 'var(--color-surface-base)',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      color: 'var(--color-text-base)'
                    }}
                    cursor={{ fill: 'var(--color-border-light-base)' }}
                  />
                  <Bar dataKey="lost" name="Lost" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="found" name="Found" fill="#14B8A6" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="recovered" name="Recovered" fill="#16A34A" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-3 justify-center">
              <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Lost
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-sm bg-accent" /> Found
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-sm bg-success" /> Recovered
              </span>
            </div>
          </motion.div>

          {/* Pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-surface border border-border rounded-2xl p-4 sm:p-5"
          >
            <h3 className="text-sm font-semibold text-text mb-4">By Category</h3>
            <div className="h-44 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid var(--color-border-base)',
                      backgroundColor: 'var(--color-surface-base)',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      color: 'var(--color-text-base)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-2">
              {data.categoryData.map((entry, i) => (
                <span key={entry.name} className="flex items-center gap-1 text-[11px] text-text-secondary">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
