import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Article } from "../../@Types/productType";
import { getAllArticles } from "../../services/article-service";
import './ArticleList.scss';

const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllArticles()
      .then(res => {
        console.log('Fetched all articles:', res);
        const data = Array.isArray(res) ? res : [];
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching articles:", err);
        setError("An error occurred while fetching the data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="article-list">
      <h1>All Articles</h1>
      <div className="article-list-grid">
        {articles.length === 0 ? (
          <p>No articles available at the moment.</p>
        ) : (
          articles.map((article) => (
            <div key={article._id} className="article-item">
              <h2>{article.title}</h2>
              <p>{article.miniText}</p>
              {article.mainImage.url && (
                <img
                  src={article.mainImage.url}
                  alt={article.mainImage.alt || article.title}
                  className="article-image"
                />
              )}
              <Link to={`/article/${article._id}`}>Read More</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArticleList;
