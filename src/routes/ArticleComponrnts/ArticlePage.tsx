// components/ArticleDetail.tsx

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Article } from "../../@Types/productType";
import { getArticleById } from "../../services/article-service";

const ArticlePage = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        if (id) {
            getArticleById(id)
                .then(res => {
                    console.log("Response from getArticleById:", res);
                    setArticle(res.data);
                })
                .catch(err => {
                    console.error("Error fetching article:", err);
                });
        }
    }, [id]);

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="article-detail">
            {article.images?.map((image, index) => (
                <img
                    key={index}
                    src={image.url}
                    alt={image.alt || "Article Image"}
                    className="article-image"
                />
            ))}
            <h1>{article.title}</h1>
            <div className="article-pages">
                {article.longText.map((page, index) => (
                    <div key={index} className="article-page">
                        <h2>{page.title}</h2>
                        <p>{page.text}</p>
                    </div>
                ))}
            </div>

            <a href="/articles">Back to Articles</a>
        </div>
    );
};

export default ArticlePage;
