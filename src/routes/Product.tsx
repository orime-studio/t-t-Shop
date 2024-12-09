import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../services/product-service';
import { IProduct } from '../@Types/productType';
import './Product.scss';
import AddToCartButton from '../components/AddToCartButton';
import { Accordion } from 'flowbite-react';
import cart from '../services/cart-service';
import { format } from 'date-fns';

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<string>('');
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProductById(id || "")
            .then(res => {
                setProduct(res.data);
                if (res.data.variants.length > 0) {
                  setSelectedVariant(res.data.variants[0]._id || '');
                }
            })
            .catch(() => setError("Failed to load product details. Please try again."));
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    const getEstimatedArrivalDate = (): string => {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        return format(deliveryDate, 'PPP');
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    const firstImage = product.images[0] || { url: '', alt: '' };
    const selectedVariantObj = product.variants.find(v => v._id === selectedVariant);

    const handleAddToCartAndRedirect = async () => {
        if (!selectedVariantObj) {
            console.error('No variant selected');
            return;
        }

        const finalPrice = product.basePrice + (product.salePrice || 0) + selectedVariantObj.color.additionalCost + selectedVariantObj.size.additionalCost;

        try {
            await cart.addProductToCart(
              product._id,
              selectedVariantObj._id || '',
              product.title,
              1,
              selectedVariantObj.size.value,
              finalPrice,
              firstImage
            );
            navigate('/cart');
        } catch (error) {
            console.error('Failed to add product to cart.', error);
        }
    };

    return (
        <div className="product-page">
            <div className="product-image-container">
                {firstImage.url && <img className="product-image" src={firstImage.url} alt={firstImage.alt} />}
                <div className="additional-images">
                    {/* ניתן להציג תמונות נוספות מכאן אם קיימות */}
                </div>
            </div>
            <div className="product-details">
                <h1 className="product-title">{product.title}</h1>
                <h2 className="product-subtitle">{product.subtitle}</h2>
                <h3 className="product-description">{product.description}</h3>
                <div className="buttons-container">
                    <AddToCartButton
                        productId={product._id}
                        variants={product.variants}
                        title={product.title}
                        images={product.images}
                        basePrice={product.basePrice}
                        salePrice={product.salePrice}
                    />
                    <button className="consult-expert-button" onClick={handleAddToCartAndRedirect}>Buy Now</button>
                </div>
                <Accordion>
                    <Accordion.Panel>
                        <Accordion.Title>Description</Accordion.Title>
                        <Accordion.Content>
                            <p className='dark:text-white'>{product.description}</p>
                        </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                        <Accordion.Title>Shipping Info</Accordion.Title>
                        <Accordion.Content>
                            <p>
                                Estimated Arrival: <strong>
                                    {selectedVariantObj && selectedVariantObj.quantity > 0 ? getEstimatedArrivalDate() : "Currently unavailable"}
                                </strong>
                            </p>
                            <p>Free Fast Shipping</p>
                            <p>Free Overnight Shipping, Hassle-Free Returns</p>
                        </Accordion.Content>
                    </Accordion.Panel>
                </Accordion>
            </div>
        </div>
    );
};

export default Product;
