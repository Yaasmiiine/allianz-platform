import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/layout.css";

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="main">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;