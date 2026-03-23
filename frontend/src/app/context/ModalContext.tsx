'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 모달 타입 정의
type ModalType = 'ALERT' | 'CONFIRM';
type ModalVariant = 'INFO' | 'SUCCESS' | 'DANGER' | 'WARNING';

interface ModalOptions {
    title: string;
    message: string;
    variant?: ModalVariant; // 색상 테마 (파랑, 초록, 빨강...)
    onConfirm?: () => void; // 확인 눌렀을 때 실행할 함수
    confirmLabel?: string;  // 확인 버튼 멘트 (예: 삭제, 네, 확인)
    cancelLabel?: string;   // 취소 버튼 멘트
}

interface ModalContextType {
    showAlert: (options: ModalOptions) => void;
    showConfirm: (options: ModalOptions) => void;
    showToast: (message: string, variant?: ModalVariant) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<ModalType>('ALERT');
    const [options, setOptions] = useState<ModalOptions>({ title: '', message: '' });

    // Toast 상태
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastVariant, setToastVariant] = useState<ModalVariant>('INFO');

    // 1. Alert 열기 (확인 버튼 하나)
    const showAlert = (opts: ModalOptions) => {
        setType('ALERT');
        setOptions({ ...opts, variant: opts.variant || 'INFO' });
        setIsOpen(true);
    };

    // 2. Confirm 열기 (확인/취소 버튼 두개)
    const showConfirm = (opts: ModalOptions) => {
        setType('CONFIRM');
        setOptions({ ...opts, variant: opts.variant || 'INFO' });
        setIsOpen(true);
    };

    // 3. 닫기
    const closeModal = () => {
        setIsOpen(false);
    };

    // 4. 확인 버튼 핸들러
    const handleConfirm = () => {
        if (options.onConfirm) options.onConfirm();
        closeModal();
    };

    // 5. Toast 알림 열기
    const showToast = (message: string, variant: ModalVariant = 'INFO') => {
        setToastMessage(message);
        setToastVariant(variant);
        setTimeout(() => setToastMessage(null), 3000); // 3초 뒤 닫힘
    };

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm, showToast }}>
            {children}

            {/* === 토스트 알림 UI === */}
            {toastMessage && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none animate-fade-in-up">
                    <div className={`px-6 py-3 rounded-full shadow-lg text-white font-medium text-sm border
                        ${toastVariant === 'DANGER' ? 'bg-red-500 border-red-400' :
                        toastVariant === 'SUCCESS' ? 'bg-green-500 border-green-400' :
                        'bg-slate-800 border-slate-700'}`}>
                        {toastMessage}
                    </div>
                </div>
            )}

            {/* === 기존 모달 UI === */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 animate-fade-in-up">

                        {/* 아이콘 & 타이틀 영역 */}
                        <div className="p-6 text-center">
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 
                ${options.variant === 'DANGER' ? 'bg-red-100 text-red-600' :
                                    options.variant === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                                        'bg-blue-100 text-blue-600'}`
                            }>
                                {options.variant === 'DANGER' ? (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                ) : options.variant === 'SUCCESS' ? (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{options.title}</h3>
                            <p className="text-sm text-slate-500 mt-2 whitespace-pre-wrap">{options.message}</p>
                        </div>

                        {/* 버튼 영역 */}
                        <div className="px-6 pb-6 flex gap-3">
                            {type === 'CONFIRM' && (
                                <button
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
                                >
                                    {options.cancelLabel || '취소'}
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                // [수정] 명시적인 배경색(bg-blue-600)과 흰색 글씨(text-white) 적용
                                className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition
                  ${options.variant === 'DANGER'
                                        ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30'
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`
                                }
                            >
                                {options.confirmLabel || '확인'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

// Custom Hook (사용할 때 이것만 부르면 됨)
export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
