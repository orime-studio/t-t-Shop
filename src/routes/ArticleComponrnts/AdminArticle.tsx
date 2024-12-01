// components/AdminArticles.tsx

import { Table, Tooltip } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import dialogs from '../../ui/dialogs';
import { Article } from '../../@Types/productType';
import { deleteArticleById, getAllArticles } from '../../services/article-service';

const AdminArticles = () => {
    const { searchTerm } = useSearch();
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllArticles()
            .then(data => {
                if (Array.isArray(data)) {
                    setArticles(data);
                    setFilteredArticles(data);
                } else {
                    setError(new Error("Unexpected response format"));
                }
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        setFilteredArticles(
            articles.filter(article =>
                article.title.toLowerCase().includes(lowercasedSearchTerm) ||
                article.source.toLowerCase().includes(lowercasedSearchTerm) ||
                article.miniText.toLowerCase().includes(lowercasedSearchTerm)
            )
        );
    }, [searchTerm, articles]);

    const handleDeleteArticle = async (articleId: string) => {
        const result = await dialogs.confirm("Delete Article", "Are you sure you want to delete this article?");
        if (result.isConfirmed) {
            try {
                await deleteArticleById(articleId);
                setArticles(articles.filter(article => article._id !== articleId));
                dialogs.success("Article Deleted", "The article was successfully deleted.");
            } catch (err) {
                dialogs.error("Error", "Failed to delete the article.");
            }
        }
    };

    return (
        <div className="admin-articles-container">
            <h2 className="admin-articles-header">Articles List</h2>
            <div className="admin-articles-add-button">
                <Tooltip content="Add Article" placement="top">
                    <Link to="admin/article/create" className="button-add-article">
                        <FiPlus size={20} />
                    </Link>
                </Tooltip>
            </div>
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="error-message">{error.message}</div>}
            {!loading && filteredArticles.length === 0 && <div className="text-center">No articles found.</div>}

            <div className="admin-articles-table">
                {!loading && filteredArticles.length > 0 && (
                    <Table hoverable>
                        <Table.Head className="text-center">
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Author</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                            <Table.HeadCell>Short Description</Table.HeadCell>
                            <Table.HeadCell>Created Date</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {filteredArticles.map((article) => (
                                <Table.Row key={article._id} className="text-right">
                                    <Table.Cell>
                                        {article.images?.[0]?.url && (
                                            <img
                                                src={article.images[0].url}
                                                alt={article.images[0].alt}
                                                className="article-image"
                                            />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>{article.source}</Table.Cell>
                                    <Table.Cell>{article.title}</Table.Cell>
                                    <Table.Cell>{article.miniText}</Table.Cell>
                                    <Table.Cell>{new Date(article.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell className="flex-col">
                                        <div className="article-actions">
                                            <Link to={`/admin/article/edit/${article._id}`} className="article-actions-link">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDeleteArticle(article._id)} className="article-actions-button">
                                                <FiTrash2 size={20} />
                                            </button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default AdminArticles;
