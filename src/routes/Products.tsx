// Products.tsx
import { FC, useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { Link, useSearchParams } from 'react-router-dom';
import { IProduct } from '../@Types/productType';
import AddToCartButton from '../components/AddToCartButton';
import { useSearch } from '../hooks/useSearch';
import { getAllProducts } from '../services/product-service';
import './Products.scss';
import Filter from '../components/FilterComponent';
import LatestArticles from './ArticleComponrnts/LatestArticle';

const Products: FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { searchTerm, minPrice, maxPrice, selectedSizes } = useSearch();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts({
                    minPrice,
                    maxPrice,
                    sizes: selectedSizes,
                    searchTerm,
                    category,
                });
                setProducts(response.data);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [minPrice, maxPrice, selectedSizes, searchTerm, category]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="product-list-wrapper">
            <Filter /> {/* קומפוננטת הפילטר */}
            <div className="product-list-container">
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map(product => (
                        <Card key={product._id} className="product-card">
                            <Link to={`/products/${product._id}`} className="product-link">
                                <img src={product.mainImage.url} alt={product.alt} className="w-full h-48 object-cover rounded-t-lg" />
                                <div className="product-info">
                                    <h5 className="text-xl font-bold">{product.title}</h5>
                                    <h6 className="text-md font-semibold">{product.subtitle}</h6>
                                    <p>{product.description}</p>
                                </div>
                            </Link>
                            <AddToCartButton
                                productId={product._id}
                                variants={product.variants}
                                title={product.title}
                                image={product.mainImage}
                            />
                        </Card>
                    ))
                )}
            </div>
            <LatestArticles />
        </div>
    );
};

export default Products;
