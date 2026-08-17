import { cn } from '@/lib/utils';
import type { ElementType, ReactNode } from 'react';

/** Consistent max-width gutter used across every section. */
export function Container({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn('mx-auto w-full max-w-edge px-6 md:px-10 lg:px-16', className)}>
      {children}
    </Tag>
  );
}
