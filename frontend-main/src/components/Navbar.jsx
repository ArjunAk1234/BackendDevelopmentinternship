import { useAuth } from '../context/AuthContext';
import { User, Bell } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">System Portal</h2>
            <div className="flex items-center gap-6">
                <Bell size={20} className="text-slate-400 cursor-pointer" />
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{user?.email}</p>
                        <p className="text-xs font-medium text-indigo-600 uppercase">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;