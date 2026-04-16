import { useQuery } from '@tanstack/react-query';
import api from '../api';

export const useWealthAnalysis = (income: number, expenses: number) => {
    return useQuery({
        queryKey: ['wealthAnalysis', income, expenses],
        queryFn: async () => {
            const response = await api.get('/wealth-analysis', {
                params: { income, expenses }
            });
            return response.data;
        }
    });
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get('/users');
            return res.data;
        }
    });
};

export const useAuditLogs = () => {
    return useQuery({
        queryKey: ['auditLogs'],
        queryFn: async () => {
            const res = await api.get('/audit-logs');
            return res.data.logs;
        }
    });
};
