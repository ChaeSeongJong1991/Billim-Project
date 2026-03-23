import React from 'react';
import { useProfitability } from '@/hooks/useExpenses';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';

export function ProfitabilityChart({ year }: { year: number }) {
    const { data, isLoading } = useProfitability(year);

    if (isLoading) return <div className="animate-pulse bg-slate-50/50 border border-slate-100 h-[450px] w-full rounded-3xl"></div>;

    // Default to empty array if no data
    const chartData = (data || []).map(d => ({
        name: `${d.month}월`,
        수입: d.revenue,
        지출: d.expense,
        순수익: d.netProfit,
        수익률: d.margin
    }));

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/60 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="font-extrabold text-slate-800 text-xl flex items-center gap-2 mb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                        입체적인 월세 가계부
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">건물 전체 수납/지출 및 {year}년 수익률 추이</p>
                </div>
            </div>

            <div className="h-[350px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 20, right: 5, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} 
                            axisLine={false} 
                            tickLine={false} 
                            dy={10} 
                        />
                        <YAxis 
                            yAxisId="left" 
                            tickFormatter={(value) => `${value / 10000}만`} 
                            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} 
                            axisLine={false} 
                            tickLine={false} 
                            dx={-10}
                        />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            tickFormatter={(value) => `${value}%`} 
                            tick={{ fontSize: 12, fill: '#10b981', fontWeight: 700 }} 
                            axisLine={false} 
                            tickLine={false} 
                            dx={10}
                        />
                        <Tooltip 
                            formatter={(value: any, name: any) => {
                                if (name === '수익률') return [`${value}%`, name];
                                return [`${Number(value).toLocaleString()}원`, name];
                            }}
                            contentStyle={{ 
                                borderRadius: '16px', 
                                border: '1px solid #f1f5f9', 
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                padding: '12px 16px',
                                fontWeight: 600,
                                fontSize: '13px'
                            }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Legend 
                            wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 600 }} 
                            iconType="circle"
                        />
                        <Bar 
                            yAxisId="left" 
                            dataKey="수입" 
                            fill="#3b82f6" 
                            radius={[6, 6, 0, 0]} 
                            barSize={24} 
                        />
                        <Bar 
                            yAxisId="left" 
                            dataKey="지출" 
                            fill="#ef4444" 
                            radius={[6, 6, 0, 0]} 
                            barSize={24} 
                        />
                        <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="수익률" 
                            stroke="#10b981" 
                            strokeWidth={3.5} 
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} 
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
