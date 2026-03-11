import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-72 border-r border-slate-200 dark:border-primary/10 bg-white dark:bg-card-dark flex flex-col fixed h-full z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary rounded-lg p-2 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">shield_with_heart</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">SecureWealth</h1>
                        <p className="text-xs text-slate-500 dark:text-primary/60 font-medium">Premium Security</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors'}`}>
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/analysis" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors'}`}>
                        <span className="material-symbols-outlined">monitoring</span>
                        <span>Wealth Analysis</span>
                    </NavLink>
                    <NavLink to="/planner" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors'}`}>
                        <span className="material-symbols-outlined">track_changes</span>
                        <span>Savings Goals</span>
                    </NavLink>
                    <NavLink to="/logs" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors'}`}>
                        <span className="material-symbols-outlined">shield</span>
                        <span>Security Logs</span>
                    </NavLink>
                </nav>
                <div className="p-6 border-t border-slate-200 dark:border-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-primary/20 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAz9Bk3VEf0Da_fKt8_FApnjc4-KnTBN4-nTWTj_YlX9wJp7_OSml_aEzOSTttGLHMBI9X1x3WK1M-KVqu0AYXRp3s8fgPFeN06-67eqCgl5YeuVdac9asvzvG44APhZTeo7I6LWe04CGU0jFhPRqK8lv2ul3g-AGt0YGyTyMr-O1qk3rI1hgKvzafjClHJueEBjcraVT4lAjlotSLmmlBAi2KmAXeUlzgJfMjeg5BZGM5xaBy2p6pZN5esiO7MM7_qDkL47FAmJCE')" }} />
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Alexander Thorne</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Pro Member</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 min-h-screen">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between px-8 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input className="w-full bg-slate-100 dark:bg-primary/5 border-none rounded-lg pl-10 text-sm py-2 focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-slate-100" placeholder="Search transactions, assets..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 relative">
                            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                        </button>
                        <button className="p-2 rounded-lg bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-primary/10"></div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold transition-transform hover:scale-[1.02]">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            <span>New Transfer</span>
                        </button>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
