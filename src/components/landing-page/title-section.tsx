"use client";

import React, { useRef, useState, useEffect } from "react";
import { TextEffect } from "../ui/TextEffect";

interface TitleSectionProps {
  title: string;
  subheading?: string;
  pill: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  subheading,
  pill,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true); 
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.5 } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col gap-4 justify-center items-start md:items-center"
    >
      {isVisible && (
        <article className="rounded-full p-[1px] text-sm dark:bg-gradient-to-r dark:from-brand-primaryBlue dark:to-brand-primaryPurple">
          <TextEffect
            className="rounded-full px-3 py-1 dark:bg-black"
            per="word"
            preset="blur"
            delay={0.5}
          >
            {pill}
          </TextEffect>
        </article>
      )}

      {isVisible && (
        <>
          <TextEffect
            className="text-left text-3xl sm:text-5xl sm:max-w-[750px] md:text-center font-semibold"
            per="word"
            preset="blur"
            delay={0.5}
          >
            {title}
          </TextEffect>

          {subheading && (
            <TextEffect
              className="dark:text-washed-purple-700 sm:max-w-[450px] md:text-center"
              per="word"
              preset="blur"
              delay={0.5}
            >
              {subheading}
            </TextEffect>
          )}
        </>
      )}

      {!subheading && (
        <h1 className="text-left text-4xl sm:text-6xl sm:max-w-[850px] md:text-center font-semibold">
          {title}
        </h1>
      )}
    </section>
  );
};

export default TitleSection;
