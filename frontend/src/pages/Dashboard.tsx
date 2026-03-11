import { useEffect, useState } from 'react';
import api from '../api';

interface WealthAnalysisData {
    savings_rate: string;
    advice: string;
}

export default function Dashboard() {
    const [wealthData, setWealthData] = useState<WealthAnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/wealth-analysis', {
                    params: {
                        income: 80000,
                        expenses: 50000
                    }
                });
                setWealthData(response.data);
            } catch (err) {
                setError('Failed to fetch wealth analysis data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            {/* Modal Overlay Placeholder */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
                    <div className="bg-white dark:bg-card-dark p-8 rounded-2xl w-[400px] border border-primary/20 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{modal === 'manage_assets' ? 'Manage Assets' : modal === 'add_goal' ? 'Add New Goal' : modal === 'add_transfer' ? 'Add New Transfer' : 'Modal Context'}</h2>
                        <p className="text-slate-500 mb-6">This is a frontend placeholder for the requested modal view.</p>
                        <button onClick={() => setModal(null)} className="w-full bg-primary py-2 rounded-lg text-white font-bold">Close</button>
                    </div>
                </div>
            )}

            {/* Global Alert Notification */}
            {alertMessage && (
                <div className="fixed top-4 right-4 z-50 bg-amber-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold flex gap-3 items-center animate-fade-in">
                    <span className="material-symbols-outlined">info</span>
                    {alertMessage}
                    <button onClick={() => setAlertMessage(null)} className="ml-4 opacity-50 hover:opacity-100">×</button>
                </div>
            )}

            <div className="p-8 space-y-8">
                {/* Welcome & Top Stats */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-primary font-medium text-sm">Summary Status</p>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Wealth Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time security monitoring and financial performance.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setModal('manage_assets')} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-primary/20 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                            Manage Assets
                        </button>
                        <button onClick={() => setModal('add_transfer')} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-primary/20 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                            Add New Transfer
                        </button>
                        <button onClick={() => setAlertMessage('Report generation initiated...')} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-primary/10 text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Generate Report
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-primary/10 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Balance</p>
                            <span className="material-symbols-outlined text-primary">account_balance</span>
                        </div>
                        <h3 className="text-2xl font-bold">$142,500.00</h3>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[#22C55E] text-xs font-bold bg-[#22C55E]/10 px-1.5 py-0.5 rounded flex items-center">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span> 2.4%
                            </span>
                            <span className="text-slate-400 text-[10px]">vs last month</span>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-primary/10 rounded-xl custom-glow-green">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Savings Rate</p>
                            <span className="material-symbols-outlined text-[#22C55E]">ecg_heart</span>
                        </div>
                        {loading ? (
                            <h3 className="text-xl font-bold text-slate-500 animate-pulse">Loading...</h3>
                        ) : error ? (
                            <h3 className="text-sm font-bold text-primary">{error}</h3>
                        ) : (
                            <h3 className="text-2xl font-bold text-[#22C55E]">{wealthData?.savings_rate}</h3>
                        )}
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[#22C55E] text-xs font-bold">Target met</span>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-primary/10 rounded-xl custom-glow-red border-primary/20">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Risks</p>
                            <span className="material-symbols-outlined text-primary">gpp_maybe</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">0 High</h3>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-primary text-xs font-bold">-100% Risk</span>
                            <span className="text-slate-400 text-[10px]">Threat Level: Nil</span>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-primary/10 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Financial Advice</p>
                            <span className="material-symbols-outlined text-amber-500">payments</span>
                        </div>
                        {loading ? (
                            <p className="text-sm font-bold text-slate-500 animate-pulse">Loading...</p>
                        ) : error ? (
                            <p className="text-sm font-bold text-primary">{error}</p>
                        ) : (
                            <p className="text-xs font-bold text-slate-300 line-clamp-2">{wealthData?.advice}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-2 text-slate-400 text-xs">
                            <span>Updated live</span>
                        </div>
                    </div>
                </div>

                {/* Second Row: Fraud Alerts & Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Fraud Alerts Section */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">crisis_alert</span>
                                Security Alerts
                            </h2>
                            <button onClick={() => setAlertMessage('Navigating to full security history...')} className="text-xs text-primary font-bold">View History</button>
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-primary">warning</span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-100">Unusual Login Attempt</p>
                                        <p className="text-xs text-slate-400">San Francisco, CA • IP: 192.168.1.1</p>
                                        <div className="mt-2 flex gap-2">
                                            <button onClick={() => setAlertMessage("Security Action: IP Blocked Successfully")} className="bg-primary text-white text-[10px] px-2 py-1 rounded font-bold transition-transform active:scale-95">Block IP</button>
                                            <button onClick={() => setAlertMessage("Flag Dismissed. Trusted Session logged.")} className="bg-white/10 text-white text-[10px] px-2 py-1 rounded font-bold transition-transform active:scale-95">It's me</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-100 dark:bg-primary/5 rounded-lg opacity-60">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-slate-400">verified</span>
                                    <div>
                                        <p className="text-sm font-bold">2FA Verified</p>
                                        <p className="text-xs text-slate-400">Transaction #9182 confirmed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Savings Goals Section */}
                    <div className="lg:col-span-2 space-y-4 bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-primary/10">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-500">ads_click</span>
                                Active Savings Goals
                            </h2>
                            <button onClick={() => setModal('add_goal')} className="text-xs text-slate-400 font-medium hover:text-slate-300">Add New Goal</button>
                        </div>
                        <div className="space-y-6 pt-4">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-sm font-bold">Real Estate Fund</p>
                                        <p className="text-xs text-slate-400">Target: $250,000</p>
                                    </div>
                                    <p className="text-sm font-black text-amber-500">65%</p>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full w-[65%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-sm font-bold">Cyber Security Setup</p>
                                        <p className="text-xs text-slate-400">Target: $15,000</p>
                                    </div>
                                    <p className="text-sm font-black text-amber-500">88%</p>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full w-[88%] shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-sm font-bold">Retirement Portfolio</p>
                                        <p className="text-xs text-slate-400">Target: $1,200,000</p>
                                    </div>
                                    <p className="text-sm font-black text-amber-500">12%</p>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full w-[12%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
