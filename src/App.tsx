import { ThemeProvider } from "@/components/themeProvider";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./views/user/Layouts/Sidebar";

function Admin() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AdminSidebar />
        <Outlet />
      </ThemeProvider>

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 p-3 bg-primary text-white w-12 h-12 rounded-full shadow-lg transition"
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
      )}
    </>
  );
}

export default Admin;