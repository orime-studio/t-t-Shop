import React from 'react';
import { Link } from 'react-router-dom';
import './MainArticle.scss';

const MainArticle = () => {
  return (
    <div className="main-article-container">
      <div className="main-article-content">
        <h2 className="main-article-title">We're on a Mission To Clean Up the Industry</h2>
        <p className="main-article-description">Read about our progress in our latest Impact Report.</p>
        <Link to="/impact-report" className="main-article-button">Read More</Link>
      </div>
    </div>
  );
};

export default MainArticle;