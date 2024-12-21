import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRightCircle } from "react-icons/fi";
import { FaArrowCircleRight } from "react-icons/fa";
import MeshGradientBackground from "../MeshGradientBackground";
import './Home.css';

function Home() {
  const [hover, setHover] = React.useState(false);
  const navigate = useNavigate();
  
  const handleHover = () => setHover(true);
  const handleLeave = () => setHover(false);
  const goToCommunity = () => {
    navigate("/community");
  };

  return (
    <div className="home-container">
      <MeshGradientBackground />
      <div className="content fade-in">
        <div className="header">
          <h1 className="slide-in-left">Harshit Padha</h1>
          <div
            onClick={goToCommunity}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            className="icon-container slide-in-right"
          >
            {hover ? <FaArrowCircleRight size={24} /> : <FiArrowRightCircle size={24} />}
          </div>
        </div>
        <p className="description slide-in-bottom">
          Chasing dreams, crafting stories, and leaving a mark.
        </p>
      </div>
    </div>
  );
}

export default Home;
