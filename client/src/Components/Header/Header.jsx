import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNoteList = location.pathname.includes("/notes");
  const handleBack = () => {
    navigate("/");
  };
  return (
    <header className="app-header">
     {isNoteList && <button onClick={handleBack}>← Back to Categories</button>}
      <h1>My Diary</h1>
    </header>
  );
};

export default Header;
