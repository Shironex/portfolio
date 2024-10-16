import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
    className?: string;
    children: React.ReactNode;
};

export const Paragraph = ({ className, children }: Props) => {
    return (
        <p
            className={cn(
                'text-sm lg:text-base font-normal text-muted-foreground',
                className
            )}
        >
            {children}
        </p>
    );
};
