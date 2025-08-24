import { useEffect, useState, RefObject } from "react";

interface UseScrollVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollVisibility(
  elementRef: RefObject<Element>,
  options: UseScrollVisibilityOptions = {},
): boolean {
  const [isVisible, setIsVisible] = useState(true);
  const { threshold = 0, rootMargin = "0px" } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [elementRef, threshold, rootMargin]);

  return isVisible;
}
