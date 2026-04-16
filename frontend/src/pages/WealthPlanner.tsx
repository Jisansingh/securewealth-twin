import { useState } from 'react';
import api from '../api';

interface GoalResult {
    goal: string;
    target_amount: number;
    future_value: number;
    goal_status: string;
    recommended_monthly_investment?: number;
}

interface InvestmentResult {
    decision: string;
    message: string;
    risk_score: number;
}

const RiskGauge = ({ score }: { score: number }) => {
    let color = "#22c55e";
    let label = "SAFE";
    if (score >= 30 && score < 60) {
        color = "#f59e0b";
        label = "WARNING";
    } else if (score >= 60) {
        color = "#ef4444";
        label = "HIGH RISK";
    }
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-primary/10 flex flex-col items-center justify-center col-span-1 md:col-span-3 lg:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">health_and_safety</span>
                Fraud Risk Score
            </h3>
            <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-40 h-40">
                    <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800/50 cursor-pointer" />
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke={color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black" style={{ color }}>{score}</span>
                </div>
            </div>
            <span className="text-sm font-bold mt-4" style={{ color }}>{label}</span>
        </div>
    );
};

export default function WealthPlanner() {
    const [goalLoading, setGoalLoading] = useState(false);
    const [goalResult, setGoalResult] = useState<GoalResult | null>(null);

    const [investmentLoading, setInvestmentLoading] = useState(false);
    const [investmentResult, setInvestmentResult] = useState<InvestmentResult | null>(null);

    const simulateGoal = async () => {
        try {
            setGoalLoading(true);
            const res = await api.post('/goal-simulation', {
                user_name: 'Alex Rivera',
                goal_name: 'Retirement Fund',
                target_amount: 1250000,
                years: 20,
                monthly_investment: 3200
            });
            setGoalResult(res.data);
        } catch (err) {
            console.error(err);
            alert('Error running goal simulation');
        } finally {
            setGoalLoading(false);
        }
    };

    const simulateInvestment = async () => {
        try {
            setInvestmentLoading(true);
            const res = await api.post('/simulate-investment', {
                user_name: 'Jisan',
                investment_amount: 200000,
                new_device: true,
                otp_retry: true
            });
            setInvestmentResult(res.data);
        } catch (err) {
            console.error(err);
            alert('Error running investment simulation');
        } finally {
            setInvestmentLoading(false);
        }
    };


    return (
        <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-8">
            {/* Hero Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Retirement Fund 2045</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Aggressive growth strategy with optimized tax sheltering.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={simulateInvestment}
                        disabled={investmentLoading}
                        className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors disabled:opacity-50">
                        {investmentLoading ? 'Simulating...' : 'Simulate $50k Investment'}
                    </button>
                    <button
                        onClick={simulateGoal}
                        disabled={goalLoading}
                        className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors disabled:opacity-50">
                        {goalLoading ? 'Running...' : 'Run Goal Scenario'}
                    </button>
                </div>
            </div>

            {/* Goal Simulation Results */}
            {goalResult && (
                <div className="bg-primary/10 border border-primary p-6 rounded-xl flex items-center justify-between animate-fade-in">
                    <div>
                        <h3 className="text-xl font-bold text-slate-100">{goalResult.goal} Projection</h3>
                        <p className="text-sm text-slate-400">Target: ${goalResult.target_amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-primary">${goalResult.future_value.toLocaleString()}</p>
                        <p className="text-xs uppercase font-bold text-slate-400">Status: <span className={goalResult.goal_status === 'on_track' ? 'text-green-500' : 'text-amber-500'}>{goalResult.goal_status}</span></p>
                        {goalResult.recommended_monthly_investment && (
                            <p className="text-xs text-slate-400 mt-1">Recommended: ${goalResult.recommended_monthly_investment}/mo</p>
                        )}
                    </div>
                </div>
            )}

            {/* Investment Simulation Results */}
            {investmentResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    <div className="bg-amber-500/10 border border-amber-500 p-6 rounded-xl flex items-center justify-between col-span-1 md:col-span-2">
                        <div>
                            <h3 className="text-xl font-bold text-slate-100">Investment Status: <span className="text-amber-500">{investmentResult.decision}</span></h3>
                            <p className="text-sm text-slate-400 mt-2">{investmentResult.message}</p>
                            <p className="text-xs font-bold text-slate-400 mt-4 uppercase">Security Check Completed</p>
                        </div>
                    </div>
                    <RiskGauge score={investmentResult.risk_score} />
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 p-6 rounded-xl">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Balance</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold">$248,500</span>
                        <span className="text-xs font-bold text-emerald-500">+14.2%</span>
                    </div>
                    <div className="mt-4 w-full h-1 bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/4"></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 p-6 rounded-xl">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Target Goal</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold">$1,250,000</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Target Date: Oct 2045</p>
                </div>
                <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 p-6 rounded-xl">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Contribution</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold">$3,200</span>
                        <span className="text-xs font-bold text-amber-500">+8%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Next auto-invest: July 1st</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 p-8 rounded-xl flex flex-col gap-4">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Goal Completion</span>
                        <h3 className="text-2xl font-bold">19.8% Achieved</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-400">Remaining Gap</p>
                        <p className="text-lg font-bold text-slate-300">$1,001,500</p>
                    </div>
                </div>
                <div className="h-4 w-full bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" style={{ width: "19.8%" }}></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>START ($0)</span>
                    <span className="text-amber-500">CURRENT MILESTONE: $250k</span>
                    <span>TARGET ($1.25M)</span>
                </div>
            </div>
        </div>
    );
}
