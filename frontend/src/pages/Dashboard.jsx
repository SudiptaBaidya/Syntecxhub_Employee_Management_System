import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/employees/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#6366F1]"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Employees', value: stats?.totalEmployees || 0, icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-100', shadow: 'shadow-indigo-100' },
    { name: 'Active', value: stats?.activeEmployees || 0, icon: UserCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-100', shadow: 'shadow-emerald-100' },
    { name: 'Inactive', value: stats?.inactiveEmployees || 0, icon: UserX, color: 'text-rose-600', bgColor: 'bg-rose-100', shadow: 'shadow-rose-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 cursor-default">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.bgColor} shadow-sm ${item.shadow}`}>
                    <item.icon className={`h-7 w-7 ${item.color}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-slate-500">{item.name}</dt>
                    <dd className="mt-2 text-4xl font-bold tracking-tight text-slate-900">{item.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Lists row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart */}
        <div className="rounded-2xl bg-white flex flex-col p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 group">
          <h3 className="text-lg font-semibold leading-6 text-slate-900 border-b border-slate-100 pb-4 mb-4">Department Distribution</h3>
          <div className="h-80 w-full relative">
            {stats?.departmentStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.departmentStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    className="stroke-white stroke-2 outline-none"
                  >
                    {stats.departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.95)' }}
                    itemStyle={{ color: '#0F172A', fontWeight: 500 }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No department data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Employees */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold leading-6 text-slate-900">Recent Employees</h3>
          </div>
          <div className="flow-root flex-1 overflow-auto pr-2">
            <ul className="-my-2 divide-y divide-slate-100">
              {stats?.recentEmployees?.length > 0 ? (
                stats.recentEmployees.map((employee) => (
                  <li key={employee._id} className="py-4 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold uppercase shadow-sm">
                          {employee.name.charAt(0)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{employee.name}</p>
                        <p className="truncate text-xs text-slate-500 mt-0.5">{employee.role} · {employee.department}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold ${
                          employee.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {employee.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">No employees yet</p>
                  <p className="text-xs text-slate-500 mt-1">Add some employees to see them here.</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
