'use client';
import Heading from '@/components/heading';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { navlinks, socials } from '@/lib/constants';
import { Navlink } from '@/lib/type';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarNavigation = ({ setOpen }: Props) => {
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <div className="flex flex-col space-y-1 my-10 relative z-[100]">
            {navlinks.map((link: Navlink) => (
                <Link
                    key={link.href}
                    href={{
                        pathname: link.href,
                    }}
                    onClick={() => isMobile && setOpen(false)}
                    className={cn(
                        'text-muted-foreground hover:text-primary transition duration-200 flex items-center space-x-2 py-2 px-2 rounded-md text-sm',
                        isActive(link.href) && 'bg-white shadow-lg text-primary'
                    )}
                >
                    <link.icon
                        className={cn(
                            'h-4 w-4 flex-shrink-0',
                            isActive(link.href) && 'text-sky-500'
                        )}
                    />
                    <span>{link.label}</span>
                </Link>
            ))}

            <Heading as="p" className="text-sm md:text-sm lg:text-sm pt-10 px-2">
                Socials
            </Heading>
            {socials.map((link: Navlink) => (
                <Link
                    key={link.href}
                    href={{
                        pathname: link.href,
                    }}
                    className={cn(
                        'text-muted-foreground hover:text-primary transition duration-200 flex items-center space-x-2 py-2 px-2 rounded-md text-sm'
                    )}
                >
                    <link.icon
                        className={cn(
                            'h-4 w-4 flex-shrink-0',
                            isActive(link.href) && 'text-sky-500'
                        )}
                    />
                    <span>{link.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default SidebarNavigation;