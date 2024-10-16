import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
    className?: string;
    children: React.ReactNode;
};

export const Highlight = ({ className, children }: Props) => {
    return (
        <span className={cn('bg-secondary px-1 mx-1 py-0.5', className)}>
            {children}
        </span>
    );
};
