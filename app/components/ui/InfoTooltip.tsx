'use client';

import { Popover, Transition, Portal } from '@headlessui/react';
import { HelpCircle, Info } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

interface InfoTooltipProps {
  content: string;
  className?: string;
  anchor?: 'top' | 'bottom' | 'left' | 'right' | 'top start' | 'top end' | 'bottom start' | 'bottom end' | 'left start' | 'left end' | 'right start' | 'right end';
}

export default function InfoTooltip({ content, className = '', anchor = 'bottom' }: InfoTooltipProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Popover className={`relative inline-block ${className}`}>
      {({ open }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors focus:outline-none ${open ? 'text-blue-500' : ''}`}
            title="Bilgi"
            onClick={(e) => e.stopPropagation()}
          >
            <Info size={14} />
          </Popover.Button>
          {mounted && (
            <Portal>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel 
                  anchor={anchor}
                  className="z-50 w-48 bg-white rounded-lg shadow-xl ring-1 ring-black/5 p-3 text-xs text-gray-600 font-medium leading-relaxed"
                >
                  {content}
                </Popover.Panel>
              </Transition>
            </Portal>
          )}
        </>
      )}
    </Popover>
  );
}
