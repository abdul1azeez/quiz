import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

 const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Target the specific scrolling div by ID
    const scrollContainer = document.getElementById("main-scroll-container");

    if (!scrollContainer) return; // Safety check

    const toggleVisibility = () => {
      // 2. Check the scroll position of that DIV, not the window
      if (scrollContainer.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 3. Attach listener to the DIV
    scrollContainer.addEventListener("scroll", toggleVisibility);
    return () => scrollContainer.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.getElementById("main-scroll-container");
    // 4. Scroll the DIV to top
    scrollContainer?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-18 right-3 lg:bottom-8 lg:right-88 z-50 p-3 rounded-full bg-button-primary text-white shadow-lg hover:bg-opacity-90 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 cursor-pointer"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default ScrollToTop;