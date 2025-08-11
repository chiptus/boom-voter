import { useState, useEffect } from "react";

export function useScrollPosition(threshold = 100) {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolledPast(currentScrollY > threshold);
    }

    // Set initial values
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { scrollY, isScrolledPast };
}
