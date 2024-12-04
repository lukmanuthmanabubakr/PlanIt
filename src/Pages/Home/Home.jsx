import React from "react";
import homePage from "../../Assets/standard-todo.webp";
import { Link } from "react-router-dom";
import "./Home.css"; // Importing the CSS file

const Home = () => {
  return (
    <div className="hero">
      {/* Overlay */}
      <div className="overlay"></div>

      {/* Moving Circles */}
      <div className="circles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Content */}
      <div className="content">
        <h1 className="title">Track Your Goals, Simplify Your Life</h1>
        <p className="subtitle">Stay on top of your tasks and attachments in one place.</p>
        <Link to="/admin-tasks">
          <button className="cta-button">Go to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
