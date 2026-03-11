import { useEffect, useState } from 'react';
import api from '../api';

interface AuditLog {
    user: string;
    action: string;
    amount: number | null;
    risk_score: number;
    decision: string;
    timestamp: string;
}

export default function SecurityAuditLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const res = await api.get('/audit-logs');
                setLogs(res.data.logs);
            } catch (err) {
                setError('Failed to fetch security audit logs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const exportCSV = () => {
        if (!logs.length) return;
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["Timestamp,Event Type,User,Amount,Risk Score,Status"]
                .concat(logs.map(l => `${l.timestamp},${l.action},${l.user},${l.amount || ''},${l.risk_score},${l.decision}`))
                .join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "security_audit_logs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Security Audit Logs</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time monitoring and investigative forensics for all system activity.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => alert('Opening advanced filter criteria panel...')} className="flex items-center gap-2 rounded-lg bg-slate-200 dark:bg-[#2d1616] px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-[#3d2121] transition-colors">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filter
                    </button>
                    <button onClick={exportCSV} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-[#2a1313] p-4 rounded-xl border border-primary/10 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Events</p>
                    <p className="text-2xl font-black dark:text-white">{logs.length}</p>
                    <p className="text-xs text-green-500 font-medium mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">trending_up</span> Live updating
                    </p>
                </div>
                <div className="bg-white dark:bg-[#2a1313] p-4 rounded-xl border border-primary/10 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Blocked Activity</p>
                    <p className="text-2xl font-black text-primary">{logs.filter(l => l.decision === 'BLOCK' || l.decision === 'blocked').length}</p>
                    <p className="text-xs text-primary/70 font-medium mt-1">Requiring immediate review</p>
                </div>
                <div className="bg-white dark:bg-[#2a1313] p-4 rounded-xl border border-primary/10 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Threat Level</p>
                    <p className="text-2xl font-black text-amber-500">Elevated</p>
                    <div className="w-full bg-slate-200 dark:bg-[#3d2121] h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-amber-500 h-full w-2/3"></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#2a1313] p-4 rounded-xl border border-primary/10 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Active Monitors</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">24/7</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Global coverage active</p>
                </div>
            </div>

            {/* Audit Table */}
            <div className="rounded-xl border border-primary/10 bg-white dark:bg-[#1d0e0e] shadow-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading security logs...</div>
                ) : error ? (
                    <div className="p-8 text-center text-primary">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#271515] text-slate-500 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-primary/5">Timestamp</th>
                                    <th className="px-6 py-4 border-b border-primary/5">Event Type</th>
                                    <th className="px-6 py-4 border-b border-primary/5">User / Origin</th>
                                    <th className="px-6 py-4 border-b border-primary/5">Amount</th>
                                    <th className="px-6 py-4 border-b border-primary/5">Risk Score</th>
                                    <th className="px-6 py-4 border-b border-primary/5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5 text-sm">
                                {logs.map((log, idx) => (
                                    <tr key={idx} className={`transition-colors ${log.decision === 'BLOCK' || log.decision === 'blocked' ? 'bg-primary/5 hover:bg-primary/10' : log.decision === 'WARN' || log.decision === 'flagged' ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-primary/5'}`}>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{log.action || 'API_ACTION'}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{log.user || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-slate-500">{log.amount ? `$${log.amount}` : '-'}</td>
                                        <td className="px-6 py-4 text-slate-500">{log.risk_score}</td>
                                        <td className="px-6 py-4 text-right">
                                            {log.decision === 'BLOCK' || log.decision === 'blocked' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white shadow-sm shadow-primary/40 uppercase">{log.decision}</span>
                                            ) : log.decision === 'WARN' || log.decision === 'flagged' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-background-dark uppercase">{log.decision}</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase">{log.decision}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-4 text-center text-slate-500">No events found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
