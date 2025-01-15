import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLatestArticles } from '../../services/article-service';
import { Article } from '../../@Types/productType';
import './Articles.scss';

const Articles = () => {
  const [lastArticles, setLastArticles] = useState<Article[]>([]);

  useEffect(() => {
    console.log("Fetching latest articles...");
    getLatestArticles() // פונקציה שמחזירה את שלושת המאמרים האחרונים
      .then(res => {
        console.log("Fetched latest articles:", res);
        setLastArticles(res);
      })
      .catch(err => {
        console.error("Error fetching latest articles:", err);
      });
  }, []);

  return (
    <div className="articles">
   
      <div className="articles-container">
        {lastArticles.length > 0 ? (
          lastArticles.map(article => (
            <div className="articles-section" key={article._id}>
                {/*  <h3 className="articles-card-title">{article.title}</h3> */}
              <div className="articles-image-wrapper">
                <img
                  src={article.mainImage?.url || ''}
                  alt={article.mainImage?.alt || article.title}
                  className="articles-image"
                />
                <div className="articles-overlay">
                  <h2 className="articles-article-title">{article.title}</h2>
                  <Link to={`/article/${article._id}`} className="articles-button">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No latest articles available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Articles;