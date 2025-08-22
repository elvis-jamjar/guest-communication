import { useCallback } from "react";

interface ScrollToSectionOptions {
  offset?: number;
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  duration?: number;
}

// Consistent, duration-based smooth scrolling (Safari-friendly)
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const smoothScrollTo = (targetY: number, duration: number = 650): void => {
  const startY = window.pageYOffset;
  const distanceY = targetY - startY;
  let startTime: number | null = null;

  const step = (timestamp: number) => {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distanceY * eased);
    if (elapsed < duration) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

/**
 * Hook for scrolling to sections by ID
 * @returns Object containing scrollToSection function and scrollToTop function
 */
export const useSectionRoute = () => {
  /**
   * Scrolls to a section by ID
   * @param sectionId - The ID of the section to scroll to
   * @param options - Optional scroll behavior options
   */
  const scrollToSection = useCallback(
    (sectionId: string, options: ScrollToSectionOptions = {}) => {
      const {
        offset = 0,
        behavior = "smooth",
        duration = 250,
        // block = "start",
        // inline = "nearest",
      } = options;

      const element = document.getElementById(sectionId);

      if (!element) {
        console.warn(`Section with ID "${sectionId}" not found`);
        return;
      }

      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const offsetPosition = absoluteElementTop - offset;

      // Respect behavior option; use instant jump when behavior is 'auto'
      if (behavior === "auto") {
        window.scrollTo(0, offsetPosition);
      } else {
        // Use custom rAF-based smooth scroll for consistent speed across browsers
        smoothScrollTo(offsetPosition, duration);
      }

      // Alternative approach using scrollIntoView if the above doesn't work as expected
      // element.scrollIntoView({
      //   behavior,
      //   block,
      //   inline
      // });
    },
    []
  );

  /**
   * Scrolls to the top of the page
   * @param options - Optional scroll behavior options
   */
  const scrollToTop = useCallback(
    (options: Omit<ScrollToSectionOptions, "offset"> = {}) => {
      const { behavior = "smooth", duration = 650 } = options;
      if (behavior === "auto") {
        window.scrollTo(0, 0);
      } else {
        smoothScrollTo(0, duration);
      }
    },
    []
  );

  return {
    scrollToSection,
    scrollToTop,
  };
};
