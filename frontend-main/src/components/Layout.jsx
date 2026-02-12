import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import { LayoutDashboard, CheckCircle, StickyNote, Package, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();

    const menu = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Tasks', path: '/tasks', icon: CheckCircle },
        { name: 'Notes', path: '/notes', icon: StickyNote },
        { name: 'Products', path: '/products', icon: Package },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col fixed h-full shadow-xl">
                <div className="p-8 text-white text-2xl font-black italic tracking-widest flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg"></div> PRIME
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    {menu.map((item) => (
                        <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <item.icon size={20} /> {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-6">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 ml-64 bg-slate-50 flex flex-col">
                <Navbar />
                <main className="p-10">{children}</main>
            </div>
        </div>
    );
};

export default Layout;