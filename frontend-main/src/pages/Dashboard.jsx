import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Mail } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="animate-in fade-in duration-700">
      <h1 className="text-4xl font-black text-slate-900 mb-2">Workspace Overview</h1>
      <p className="text-slate-500 text-lg mb-10">Real-time system monitoring and account status.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Card */}
        <div className="lg:col-span-2 glass-card p-8 flex items-center gap-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
            <User size={48} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-slate-800">{user?.email}</h2>
              <ShieldCheck className="text-emerald-500" size={20} />
            </div>
            <p className="text-slate-500 flex items-center gap-2"><Mail size={16} /> Registered Account Email</p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-black uppercase tracking-widest border border-indigo-200">
                Role: {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="relative z-10">
            <p className="text-indigo-400 font-bold uppercase tracking-tighter mb-2">Network Status</p>
            <h3 className="text-3xl font-black mb-4">Secure & Live</h3>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              API Connected
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;