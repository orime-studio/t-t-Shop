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
            {/* Main Image */}
            {article?.mainImage && (
                <div className="full-width-image-container">
                    <img 
                        src={article.mainImage.url} 
                        alt={article.mainImage.alt || "Main image"} 
                        className="full-width-image" 
                    />
                </div>
            )}

            {/* Title and Short Description */}
            <div className="article-header">
                <h1 className="article-title">{article.title}</h1>
                <p className="article-miniText">{article.miniText}</p>
            </div>

            {/* Article Content: Long Text and Images */}
            {article?.longText?.map((page, index) => (
                <Section
                    key={index}
                    title={page.title}
                    text={page.text}
                    images={article.images}  // Passing all images here
                    isLeftAligned={index % 2 !== 0} // Alternate alignment: left and right
                />
            ))}

            {/* Back to Articles Link */}
            <a href="/articles" className="back-to-articles">חזרה למאמרים</a>
        </div>
    );
};

const Section = ({ title, text, images, isLeftAligned }) => (
    <section className={`section ${isLeftAligned ? 'left-align' : 'right-align'}`}>
        <div className="text-image-container">
            <div className="article-text-content">
                <h2 className="section-title-article">{title}</h2>
                <p className="section-description-article">{text}</p>
            </div>

            {/* Displaying all images */}
            {images?.map((image, index) => (
                <img 
                    key={index}
                    src={image.url} 
                    alt={image.alt || `Image ${index + 1}`} 
                    className="section-image-article" 
                />
            ))}
        </div>
    </section>
);



export default ArticlePage;
