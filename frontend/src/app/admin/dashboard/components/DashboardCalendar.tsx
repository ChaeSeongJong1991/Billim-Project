import React, { useState } from 'react';
import { useDashboardCalendar, DailyPaymentStatus } from '@/hooks/useDashboard';

export default function DashboardCalendar() {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-indexed for backend API
    const [selectedDate, setSelectedDate] = useState<DailyPaymentStatus | null>(null);

    const { data: calendarData, isLoading } = useDashboardCalendar(currentYear, currentMonth);

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentYear(prev => prev - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentYear(prev => prev + 1);
            setCurrentMonth(1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month - 1, 1).getDay();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const dayCells = [];
    for (let i = 0; i < firstDay; i++) {
        dayCells.push(<div key={`empty-${i}`} className="p-2 border border-slate-100 bg-slate-50 min-h-[80px]" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayData = calendarData?.dailyStatuses.find(s => s.date === dateString);

        dayCells.push(
            <div 
                key={`day-${d}`} 
                className={`p-2 border border-slate-100 min-h-[80px] cursor-pointer hover:bg-blue-50 transition relative ${selectedDate?.date === dateString ? 'bg-blue-100 border-blue-400' : 'bg-white'}`}
                onClick={() => dayData && setSelectedDate(dayData)}
            >
                <div className="text-sm font-medium text-slate-700">{d}</div>
                {dayData && (
                    <div className="absolute bottom-2 left-2 right-2 flex justify-end">
                        <span className={`h-3 w-3 rounded-full ${dayData.status === 'PAID' ? 'bg-green-500' : dayData.status === 'OVERDUE' ? 'bg-red-500' : 'bg-orange-400'}`}></span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">월별 납부 캘린더</h3>
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevMonth} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600">◀</button>
                    <span className="font-bold text-slate-700">{currentYear}년 {currentMonth}월</span>
                    <button onClick={handleNextMonth} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600">▶</button>
                </div>
            </div>

            <div className="grid grid-cols-7 text-center text-sm font-bold text-slate-500 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 border-l border-t border-slate-100 rounded overflow-hidden">
                {dayCells}
            </div>

            {selectedDate && (
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <h4 className="font-bold text-slate-800 mb-2">{selectedDate.date} 납부 요약</h4>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">상태: 
                            <span className={`ml-2 font-bold ${selectedDate.status === 'PAID' ? 'text-green-600' : selectedDate.status === 'OVERDUE' ? 'text-red-600' : 'text-orange-500'}`}>
                                {selectedDate.status === 'PAID' ? '완납' : selectedDate.status === 'OVERDUE' ? '미납/연체' : '대기중'}
                            </span>
                        </span>
                        <div className="space-x-4">
                            <span className="text-slate-500">청구액: {(selectedDate.expectedAmount).toLocaleString()}원</span>
                            <span className="text-slate-800 font-bold">수납액: {(selectedDate.paidAmount).toLocaleString()}원</span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex gap-4 mt-4 text-xs justify-end text-slate-500">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 완납</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> 대기중</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 연체</div>
            </div>
        </div>
    );
}
