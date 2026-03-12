'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ModalProvider } from './context/ModalContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60, // 1분
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <ModalProvider>
                {children}
            </ModalProvider>
        </QueryClientProvider>
    );
}
