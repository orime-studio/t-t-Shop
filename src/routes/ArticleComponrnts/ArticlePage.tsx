import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Article } from "../../@Types/productType";
import { getArticleById } from "../../services/article-service";
import './ArticlePage.scss';

const ArticlePage = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            getArticleById(id)
                .then(res => {
                    setArticle(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError("Failed to load article.");
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return <div className="loading">טוען...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!article) {
        return <div className="no-article">לא נמצא מאמר</div>;
    }

    return (
        <div className="article-container">
            {/* תמונה ראשית */}
            {article.images.length > 0 && (
                <div className="full-width-image-container">
                    <img src={article.images[0].url} alt={article.images[0].alt} className="full-width-image" />
                </div>
            )}

            {article.longText.map((page, index) => (
                <Section
                    key={index}
                    title={page.title}
                    text={page.text}
                    image={article.images[index + 1]}
                    isLeftAligned={index % 2 !== 0} // לסירוגין: פעם אחת ימין, פעם אחת שמאל
                />
            ))}

            <a href="/articles" className="back-to-articles">חזרה למאמרים</a>
        </div>
    );
};

const Section = ({ title, text, image, isLeftAligned }) => (
    <section className={`section ${isLeftAligned ? 'left-align' : 'right-align'}`}>
        <div className="text-image-container">
            <div className="article-text-content">
                <h2 className="section-title-article">{title}</h2>
                <p className="section-description-article">{text}</p>
            </div>
            {image && <img src={image.url} alt={image.alt} className="section-image-article" />}
        </div>
    </section>
);

export default ArticlePage;

