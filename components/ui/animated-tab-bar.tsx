"use client";

import * as React from "react";
import { useState, useRef, useLayoutEffect, useCallback } from "react";

export interface TabItem {
  icon: React.ReactNode;
  color: string;
}

export interface AnimatedTabBarProps {
  items: TabItem[];
  defaultIndex?: number;
  onTabChange?: (index: number) => void;
}

const tabBarStyles = `
.animated-tab-bar {
  --bgColorMenu: #1d1d27;
  --duration: 0.7s;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: center;
}
.animated-tab-bar *,
.animated-tab-bar *::before,
.animated-tab-bar *::after {
  box-sizing: inherit;
}
.animated-tab-bar menu {
  list-style: none;
}
.menu {
  background-color: var(--bgColorMenu);
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 32.05em;
  margin: 0;
  padding: 0 2.85em;
  font-size: 1.5em;
  display: flex;
  position: relative;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.menu__item {
  all: unset;
  z-index: 100;
  cursor: pointer;
  will-change: transform;
  transition: transform var(--timeOut, var(--duration));
  border-radius: 50%;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  padding: 0.55em 0 0.85em;
  display: flex;
  position: relative;
}
.menu__item:before {
  content: "";
  z-index: -1;
  width: 4.2em;
  height: 4.2em;
  transition: background-color var(--duration), transform var(--duration);
  border-radius: 50%;
  position: absolute;
  transform: scale(0);
}
.menu__item.active {
  transform: translateY(-0.8em);
}
.menu__item.active:before {
  background-color: var(--bgColorItem);
  transform: scale(1);
}
.icon {
  stroke: #fff;
  fill: #0000;
  stroke-width: 1pt;
  stroke-miterlimit: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 400;
  width: 2.6em;
  height: 2.6em;
}
.menu__item.active .icon {
  animation: 1.5s reverse strok;
}
@keyframes strok {
  to { stroke-dashoffset: 400px; }
}
.menu__border {
  clip-path: url(#menu-clip-path);
  will-change: transform;
  background-color: var(--bgColorMenu);
  width: 10.9em;
  height: 2.4em;
  transition: transform var(--timeOut, var(--duration));
  position: absolute;
  bottom: 99%;
  left: 0;
}
.svg-container {
  width: 0;
  height: 0;
  position: absolute;
}
@media screen and (max-width: 50em) {
  .menu { font-size: 0.8em; }
}
`;

export const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  items,
  defaultIndex = 0,
  onTabChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const menuRef = useRef<HTMLMenuElement>(null);
  const menuBorderRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const offsetMenuBorder = useCallback(() => {
    const activeItem = itemRefs.current[activeIndex];
    const menu = menuRef.current;
    const menuBorder = menuBorderRef.current;

    if (activeItem && menu && menuBorder) {
      const offsetActiveItem = activeItem.getBoundingClientRect();
      const left = Math.floor(
        offsetActiveItem.left -
          menu.getBoundingClientRect().left -
          (menuBorder.offsetWidth - offsetActiveItem.width) / 2,
      );
      menuBorder.style.transform = `translate3d(${left}px, 0, 0)`;
    }
  }, [activeIndex]);

  useLayoutEffect(() => {
    offsetMenuBorder();
    const handleResize = () => {
      if (menuRef.current) {
        const menuStyle = menuRef.current.style;
        menuStyle.setProperty("--timeOut", "none");
      }
      offsetMenuBorder();
    };

    window.addEventListener("resize", handleResize);
    // Initial jump to right place on mount
    setTimeout(offsetMenuBorder, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [offsetMenuBorder]);

  const handleItemClick = (index: number) => {
    if (menuRef.current) {
      const menuStyle = menuRef.current.style;
      menuStyle.removeProperty("--timeOut");
    }
    if (activeIndex === index) return;
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className="animated-tab-bar">
      <style dangerouslySetInnerHTML={{ __html: tabBarStyles }} />
      <div className="svg-container">
        <svg viewBox="0 0 202.9 45.5">
          <clipPath
            id="menu-clip-path"
            clipPathUnits="objectBoundingBox"
            transform="scale(0.0049285362247413 0.021978021978022)"
          >
            <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7 c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5 c9.2,3.6,17.6,4.2,23.3,4H6.7z" />
          </clipPath>
        </svg>
      </div>

      <menu className="menu" ref={menuRef}>
        {items.map((item, index) => (
          <button
            key={index}
            ref={(el) => { itemRefs.current[index] = el; }}
            className={`menu__item ${activeIndex === index ? "active" : ""}`}
            style={{ "--bgColorItem": item.color } as React.CSSProperties}
            onClick={() => handleItemClick(index)}
            aria-label={`Tab ${index + 1}`}
          >
            {item.icon}
          </button>
        ))}
        <div className="menu__border" ref={menuBorderRef}></div>
      </menu>
    </div>
  );
};

export default AnimatedTabBar;


