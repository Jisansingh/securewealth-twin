import { useUsers } from '../api/hooks';

interface User {
    username: string; // Updated to match backend response
}

export default function WealthAnalysis() {
    const { data: users = [], isLoading: loading, error: queryError } = useUsers();
    const error = queryError ? 'Failed to fetch user data' : null;


    return (
        <div className="p-8 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-primary/5 p-6 rounded-2xl border border-primary/10 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute -right-4 -top-4 text-primary/5 text-8xl material-symbols-outlined">account_balance</div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Net Worth</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black">$245,680</h3>
                        <span className="text-xs font-bold text-green-500 flex items-center">+5.2% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-4">Compared to last month: +$12,140</p>
                </div>
                <div className="bg-white dark:bg-primary/5 p-6 rounded-2xl border border-primary/10 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute -right-4 -top-4 text-primary/5 text-8xl material-symbols-outlined">payments</div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Monthly Surplus</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black">+$2,400</h3>
                        <span className="text-xs font-bold text-green-500 flex items-center">+1.8% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-4">Projected surplus: $3,100 next month</p>
                </div>
                <div className="bg-white dark:bg-primary/5 p-6 rounded-2xl border border-primary/10 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute -right-4 -top-4 text-primary/5 text-8xl material-symbols-outlined">analytics</div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Asset Allocation</p>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                <span>Risk Level</span>
                                <span className="text-primary">Moderate</span>
                            </div>
                            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: "65%" }}></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-4">Optimal balance for current market</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Savings Rate Gauge */}
                <div className="lg:col-span-1 bg-white dark:bg-primary/5 p-8 rounded-2xl border border-primary/10 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="flex items-center justify-between w-full mb-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">Savings Gauge</h4>
                        <span className="material-symbols-outlined text-primary cursor-pointer">info</span>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <svg className="w-48 h-48 transform -rotate-90 text-slate-100 dark:text-primary/10">
                            <circle cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                            <circle className="text-primary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset="359.4" strokeLinecap="round" strokeWidth="12"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
                            <span className="text-4xl font-black">35%</span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Savings Rate</span>
                        </div>
                    </div>
                    <div className="space-y-4 w-full">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Current</span>
                            <span className="font-bold">35% ($1,250)</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Goal</span>
                            <span className="font-bold text-primary">50% ($1,800)</span>
                        </div>
                        <div className="pt-4 border-t border-primary/5 w-full">
                            <p className="text-[11px] text-slate-400 italic">"Increasing your savings by just 5% could shave 2 years off your retirement goal."</p>
                        </div>
                    </div>
                </div>

                {/* Growth Analysis & Advice */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-primary/5 p-8 rounded-2xl border border-primary/10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-lg font-bold">Wealth Progression</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Projected vs actual growth over the last 12 months</p>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-primary/10 p-1 rounded-lg">
                                <button onClick={() => alert('Filter applied: Last 12 Months')} className="px-3 py-1 text-[10px] font-bold uppercase rounded-md bg-white dark:bg-primary text-slate-900 dark:text-white shadow-sm">12M</button>
                                <button onClick={() => alert('Filter applied: All Time')} className="px-3 py-1 text-[10px] font-bold uppercase rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">All</button>
                            </div>
                        </div>
                        {/* Mini Chart Visualization */}
                        <div className="h-48 w-full flex items-end justify-between gap-1 mb-6">
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[40%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[45%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[42%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[50%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[55%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[60%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[58%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[65%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[72%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[78%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-colors h-[85%] rounded-t-sm"></div>
                            <div className="w-full bg-primary/80 h-[92%] rounded-t-sm"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase px-1">
                            <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Advice Card 1 */}
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">lightbulb</span>
                            </div>
                            <div>
                                <h5 className="text-sm font-bold mb-1">Tax Efficiency Tip</h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Consider shifting $2k to your 401(k) to reduce taxable income this quarter.</p>
                            </div>
                        </div>
                        {/* Advice Card 2 */}
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">auto_graph</span>
                            </div>
                            <div>
                                <h5 className="text-sm font-bold mb-1">Portfolio Rebalance</h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Your tech exposure is at 45%. We suggest diversifying to green energy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden">
                <div className="p-6 border-b border-primary/5 flex items-center justify-between">
                    <h4 className="text-lg font-bold">Platform Users</h4>
                    <button onClick={() => alert('Opening User Management System...')} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                        Manage <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading user database...</div>
                ) : error ? (
                    <div className="p-8 text-center text-primary">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-primary/10 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-8 py-3">ID</th>
                                    <th className="px-8 py-3">User Name</th>
                                    <th className="px-8 py-3">Email Address</th>
                                    <th className="px-8 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5 text-sm">
                                {users.map((user, idx) => (
                                    <tr key={user.id || idx} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-4 text-slate-500 dark:text-slate-400 font-medium">#{user.id || (idx + 1).toString().padStart(4, '0')}</td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <span className="font-medium text-slate-900 dark:text-slate-100">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-slate-500 dark:text-slate-400 font-medium">{user.email}</td>
                                        <td className="px-8 py-4 text-right">
                                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">ACTIVE</span>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan={4} className="px-8 py-4 text-center text-slate-500">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
