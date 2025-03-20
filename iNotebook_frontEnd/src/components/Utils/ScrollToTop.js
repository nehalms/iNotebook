import { useEffect, useState } from "react";
import { ArrowUpCircle } from "lucide-react";

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button 
        className={`position-fixed btn btn-dark shadow-lg rounded ${isVisible ? "d-block" : "d-none"}`}
            onClick={scrollToTop} 
            style={{ width: "50px", height: "50px", position: 'fixed', right: '20px', bottom: '20px', zIndex: '1'}}
        >
            <ArrowUpCircle size={24} />
        </button>
    );
};

export default ScrollToTopButton;
