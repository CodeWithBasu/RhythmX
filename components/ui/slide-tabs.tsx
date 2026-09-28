"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export const SlideTabs = ({
  tabs,
  activeId,
  onChange,
}: {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeId);
    const selectedTab = tabsRef.current[activeIndex !== -1 ? activeIndex : 0];
    if (selectedTab) {
      const { width } = selectedTab.getBoundingClientRect();
      setPosition({
        left: selectedTab.offsetLeft,
        width,
        opacity: 1,
      });
    }
  }, [activeId, tabs]);

  return (
    <ul
      onMouseLeave={() => {
        const activeIndex = tabs.findIndex((t) => t.id === activeId);
        const selectedTab = tabsRef.current[activeIndex !== -1 ? activeIndex : 0];
        if (selectedTab) {
          const { width } = selectedTab.getBoundingClientRect();
          setPosition({
            left: selectedTab.offsetLeft,
            width,
            opacity: 1,
          });
        }
      }}
      className="relative mx-auto flex w-fit items-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl p-1.5 shadow-2xl"
    >
      {tabs.map((tab, i) => (
        <Tab
          key={tab.id}
          ref={(el: HTMLLIElement | null) => {
            tabsRef.current[i] = el;
          }}
          setPosition={setPosition}
          onClick={() => onChange(tab.id)}
          isActive={activeId === tab.id}
        >
          <div className="flex items-center justify-center gap-2">
            {tab.icon}
            <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
          </div>
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
};

const Tab = React.forwardRef<
  HTMLLIElement,
  {
    children: React.ReactNode;
    setPosition: any;
    onClick: () => void;
    isActive: boolean;
  }
>(({ children, setPosition, onClick, isActive }, ref) => {
  return (
    <li
      ref={ref}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!ref || !("current" in ref) || !ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className={`relative z-10 block cursor-pointer px-4 py-2 sm:px-5 sm:py-2.5 transition-colors ${
        isActive ? "text-white" : "text-white/60 hover:text-white/90"
      }`}
    >
      {children}
    </li>
  );
});
Tab.displayName = "Tab";

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={{
        left: position.left,
        width: position.width,
        opacity: position.opacity,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute z-0 top-[6px] bottom-[6px] rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
    />
  );
};