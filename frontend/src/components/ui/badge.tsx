import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-indigo-600 text-white',
                secondary: 'border-transparent bg-gray-100 text-gray-900',
                destructive: 'border-transparent bg-red-500 text-white',
                outline: 'text-gray-900 border-gray-300',
                software: 'border-transparent bg-indigo-100 text-indigo-700',
                agents: 'border-transparent bg-violet-100 text-violet-700',
                automation: 'border-transparent bg-emerald-100 text-emerald-700',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

/**
 * Badge component for labels and categories
 */
function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
