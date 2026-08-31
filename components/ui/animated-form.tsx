"use client";

import { IoMdCheckmark } from "react-icons/io";
import { FaGithub, FaDiscord, FaSpotify, FaApple } from "react-icons/fa6";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AnimatedFormProps = {
  delay?: number;
  name?: string;
};

const AnimatedForm = ({
  delay = 7000,
  name = "Alex Morgan",
}: AnimatedFormProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  const delayTime = Math.max(delay, 7000);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, delayTime);

    return () => clearInterval(interval);
  }, [delayTime]);

  return <Animatedform key={animationKey} name={name} />;
};

export default AnimatedForm;

const Animatedform = ({ name }: { name: string }) => {
  const password = "********";
  const circleLength = 2 * Math.PI * 50;

  const nameAnimationDuration = Math.ceil(name.length / 5);
  const passwordAnimationDuration = 2;
  const nameStaggerDelay = nameAnimationDuration / name.length;
  const passwordStaggerDelay = passwordAnimationDuration / password.length;

  const icons = [
    { icon: <FaGithub className="size-6 text-white/80" />, key: "github" },
    { icon: <FaDiscord className="size-6 text-[#5865F2]" />, key: "discord" },
    { icon: <FaSpotify className="size-6 text-[#1DB954]" />, key: "spotify" },
    { icon: <FaApple className="size-6 text-white/80" />, key: "apple" },
  ];

  return (
    <div className={cn("relative", "w-full max-w-[340px]")}>
      <div className="w-full rounded-[12px] border border-neutral-200/60 p-1.5 dark:border-neutral-900/60 bg-white dark:bg-[#0C0414]">
        <div
          className={cn(
            "relative",
            "flex flex-col gap-1 divide-y divide-neutral-200 rounded-lg",
            "border border-neutral-200 dark:divide-neutral-900 dark:border-neutral-900",
          )}
        >
          <div
            className={cn(
              "px-3 pb-2 pt-3 text-[14px] leading-[1rem] tracking-wide text-transparent",
              "bg-gradient-to-r from-neutral-700 to-neutral-300 bg-clip-text dark:from-neutral-400 dark:to-neutral-700",
            )}
          >
            Create Account
          </div>
          <div className="flex flex-col gap-2 p-2">
            <div
              className={cn(
                "w-full rounded-md border p-2",
                "flex items-center justify-between gap-4",
                "bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-[#130820] dark:to-[#1A0B2E]",
              )}
            >
              <div className="text-xs">
                {name.split("").map((char, index) => (
                  <motion.span
                    key={`name-${index}`}
                    className="inline-block font-[350]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.1,
                      delay: index * nameStaggerDelay,
                      ease: "easeOut",
                    }}
                  >
                    {char === " " ? " " : char}
                  </motion.span>
                ))}
              </div>

              <AnimatedCheckmarkCircle
                circleLength={circleLength}
                strokeDuration={nameAnimationDuration * 3 + 1}
                strokeDelay={0}
                fillDelay={nameAnimationDuration + 0.1}
                checkmarkDelay={nameAnimationDuration + 0.2}
              />
            </div>

            <div
              className={cn(
                "rounded-md border p-2",
                "flex items-center justify-between gap-8",
                "bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-[#130820] dark:to-[#1A0B2E]",
              )}
            >
              <div className="font-mono text-xs">
                {password.split("").map((char, index) => (
                  <motion.span
                    key={`password-${index}`}
                    className="inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.1,
                      delay:
                        nameAnimationDuration +
                        0.5 +
                        index * passwordStaggerDelay,
                      ease: "easeOut",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <AnimatedCheckmarkCircle
                circleLength={circleLength}
                strokeDuration={7}
                strokeDelay={nameAnimationDuration + 0.5}
                fillDelay={
                  nameAnimationDuration + passwordAnimationDuration + 0.6
                }
                checkmarkDelay={
                  nameAnimationDuration + passwordAnimationDuration + 0.7
                }
              />
            </div>
            <div
              className={cn(
                "h-[37.6px] rounded-md border opacity-40",
                "bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-[#130820] dark:to-[#1A0B2E]",
              )}
            />
          </div>
        </div>
      </div>
      <ContainerMask />
      <div className="absolute bottom-0 left-0 flex h-[50px] w-full items-center justify-around px-6">
        {icons.map(({ icon, key }) => (
          <div
            key={key}
            className="rounded-full bg-gradient-to-b from-neutral-300 to-neutral-100 p-2 dark:from-[#130820] dark:to-[#1A0B2E] border border-white/5 shadow-lg"
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
};

type AnimatedCheckmarkCircleProps = {
  circleLength: number;
  strokeDuration: number;
  strokeDelay: number;
  fillDelay: number;
  checkmarkDelay: number;
};

export const AnimatedCheckmarkCircle = ({
  circleLength,
  strokeDuration,
  strokeDelay,
  fillDelay,
  checkmarkDelay,
}: AnimatedCheckmarkCircleProps) => {
  return (
    <div className="relative">
      <svg width="20" height="20" className="rotate-[-90deg]">
        <motion.circle
          cx="10"
          cy="10"
          r="7"
          stroke="#22c55e"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={circleLength}
          strokeDashoffset={circleLength}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: strokeDuration,
            ease: "easeInOut",
            delay: strokeDelay,
          }}
        />
        <motion.circle
          cx="10"
          cy="10"
          r="7"
          fill="#22c55e"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.2,
            delay: fillDelay,
          }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-background"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.2,
          delay: checkmarkDelay,
        }}
      >
        <IoMdCheckmark className="size-2.5" />
      </motion.div>
    </div>
  );
};

const ContainerMask = () => {
  return (
    <>
      <div className="absolute bottom-0 left-0 h-[40px] w-full [background-image:linear-gradient(to_top,#0C0414_60%,transparent_100%)]" />
      <div className="absolute bottom-0 left-0 h-[100px] w-[12px] [background-image:linear-gradient(to_top,#0C0414_60%,transparent_100%)]" />
      <div className="absolute bottom-0 right-0 h-[100px] w-[12px] [background-image:linear-gradient(to_top,#0C0414_60%,transparent_100%)]" />
    </>
  );
};


