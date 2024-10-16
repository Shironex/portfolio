'use client';
import Badge from '@/components/badge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { IconLayoutSidebarRightCollapse } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import SidebarHeader from './sidebar-header';
import SidebarNavigation from './sidebar-navigation';

const Sidebar = () => {
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [open, setOpen] = useState(isMobile ? false : true);

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.aside
                        initial={{ x: -200 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.2, ease: 'linear' }}
                        exit={{ x: -200 }}
                        className="px-6  z-[100] py-10 bg-neutral-100 max-w-[14rem] lg:w-fit  fixed lg:relative  h-screen left-0 flex flex-col justify-between"
                    >
                        <div className="flex-1 overflow-auto">
                            <SidebarHeader />
                            <SidebarNavigation setOpen={setOpen} />
                        </div>
                        <div onClick={() => isMobile && setOpen(false)}>
                            <Badge href="/resume" text="Read Resume" />
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
            <button
                className="fixed lg:hidden bottom-4 right-4 h-8 w-8 border border-neutral-200 rounded-full backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setOpen(!open)}
            >
                <IconLayoutSidebarRightCollapse className="h-4 w-4 text-secondary" />
            </button>
        </>
    );
};

export default Sidebar;