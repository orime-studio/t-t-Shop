import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Article } from "../../@Types/productType";
import { getLatestArticles } from "../../services/article-service";
import './LatestArticles.scss';

const LatestArticles = () => {
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
    <div className="latest-articles">
      <h2 className="article-list-title">Our Latest Articles</h2>
      <div className="latest-articles-grid">
      {lastArticles.length > 0 ? (
        lastArticles.map(article => (
          <Link to={`/article/${article._id}`} className="article-link" key={article._id}>
            <div className="article-card">
              {article.mainImage?.url && (
                <div className="article-image-wrapper">
                  <img
                    src={article.mainImage.url}
                    alt={article.mainImage.alt || article.title}
                    className="article-image"
                  />
                </div>
              )}
              <div className="article-details">
                <h2 className="article-title">{article.title}</h2>
                <p className="article-mini-text">{article.miniText}</p>
                <p className="article-source">{article.source}</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>No latest articles available at the moment.</p>
      )}
    </div>
    </div>
  );
};

export default LatestArticles;