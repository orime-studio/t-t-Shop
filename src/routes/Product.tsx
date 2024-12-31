import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../services/product-service';
import { IImage, IProduct } from '../@Types/productType';
import './Product.scss';
import AddToCartButton from '../components/AddToCartButton';
import { Accordion } from 'flowbite-react';
import cart from '../services/cart-service';
import { format } from 'date-fns';

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<string>('');
    const [mainImage, setMainImage] = useState<IImage | null>(null);
    const [images, setImages] = useState<IImage[]>([]); // Added: מערך אחד לכל התמונות
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProductById(id || "")
            .then(res => {
                setProduct(res.data);
                setSelectedVariant(res.data.variants[0]._id);
                setMainImage(res.data.mainImage); // הגדרת התמונה הראשית כאובייקט
                setImages([res.data.mainImage, ...res.data.images]); // Changed: שילוב התמונה הראשית עם התמונות הנוספות


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

    const handleAddToCartAndRedirect = async () => {
        if (!selectedVariant) {
            console.error('No variant selected');
            return;
        }
        try {
            await cart.addProductToCart(product._id, selectedVariant, product.title, 1, product.variants.find(v => v._id === selectedVariant)?.size || '', product.variants.find(v => v._id === selectedVariant)?.price || 0, mainImage, product.variants.find(v => v._id === selectedVariant)?.colors[0].name || '');
            navigate('/cart');
        } catch (error) {
            console.error('Failed to add product to cart.', error);
        }
    };

    const handleThumbnailClick = (image: IImage) => { // קבלת אובייקט IImage
        setMainImage(image);
    };

    return (
        <div className="product-page">
            <div className="product-image-container">
                <img className="product-image" src={mainImage.url} alt={product.alt} />
                <div className="additional-images">
                    {images?.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={product.alt}
                            className={`additional-image ${mainImage === image.url ? 'selected' : ''}`}
                            onClick={() => handleThumbnailClick(image)}
                        />
                    ))}
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
                        image={product.images[0]}
                    />
                    {/*   <div className="buyNow-container"> */}
                    <button className="consult-expert-button" onClick={handleAddToCartAndRedirect}>Buy Now</button>
                    {/*   </div> */}
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
                                Estimated Arrival:
                                <strong>
                                    {product.variants.find(v => v._id === selectedVariant)
                                        ?.colors.reduce((total, color) => total + color.quantity, 0) > 0
                                        ? getEstimatedArrivalDate()
                                        : "Currently unavailable"}
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
