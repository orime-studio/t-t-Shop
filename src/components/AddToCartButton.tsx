import { FC, useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import './AddToCartButton.scss';
import { AddToCartButtonProps, IVariant } from '../@Types/productType';
import useCart from '../hooks/useCart';
import dialogs from '../ui/dialogs';
import { useAuth } from '../hooks/useAuth';
import Alert from './Alert';

const AddToCartButton: FC<AddToCartButtonProps> = ({ productId, variants, title, image }) => {
    const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(variants[0] || null);
    const [selectedColor, setSelectedColor] = useState<string | null>(selectedVariant?.colors[0]?.name || null);
    const { addToCart } = useCart();
    const { isLoggedIn } = useAuth();

    const [alert, setAlert] = useState<{ show: boolean, type: string, message: string }>({ show: false, type: '', message: '' });


    // חישוב הכמות הכוללת מכל הצבעים
    const totalQuantity = selectedVariant?.colors.reduce((sum, color) => sum + color.quantity, 0) || 0;

    useEffect(() => {
        if (selectedVariant && !selectedVariant.colors.some(color => color.name === selectedColor)) {
            setSelectedColor(selectedVariant.colors[0]?.name || null);
        }
    }, [selectedVariant]);

    const handleAddToCart = async () => {
        if (selectedVariant && selectedColor) {
            console.log("Adding product to cart:", selectedVariant);
            try {
                // הוספת המוצר לעגלה
                await addToCart(productId, selectedVariant._id, title, 1, selectedVariant.size, selectedVariant.price, image, selectedColor);

                setAlert({
                    show: true,
                    type: 'success',
                    message: ` Product "${title}" was added to cart!`
                });

                setTimeout(() => {
                    setAlert({ show: false, type: '', message: '' });
                }, 3000);
                
            } catch (error) {
                console.error("Failed to add product to cart:", error);
                // הצגת Alert שגיאה
                setAlert({
                    show: true,
                    type: 'error',
                    message: 'Product was not added to cart. Please try again later.'
                });

                // סגירת Alert לאחר 3 שניות
                setTimeout(() => {
                    setAlert({ show: false, type: '', message: '' });
                }, 3000);
            }
        
        } else {
            console.error("No variant or color selected");
            // הצגת Alert אזהרה אם אין וריאנט או צבע נבחר
            setAlert({
                show: true,
                type: 'warning',
                message: 'Please select a variant and color before adding to cart.'
            });

            // סגירת Alert לאחר 3 שניות
            setTimeout(() => {
                setAlert({ show: false, type: '', message: '' });
            }, 3000);
        }
   
    };

    const getColorCode = (colorName: string) => {
        const colors: { [key: string]: string } = {
            'בז\'': '#d1b69b',    // Beige
            'חום': '#9b694b',     // Brown
            'שחור': '#16140f',    // Black
            'לבן': '#FFFFFF',     // White
            'אפור': '#CCCCCC',    // Gray
            'ורוד עתיק': '#D2A4A1', // Antique Pink (from the first image)
            'תכלת': '#A3D4E7',    // Light Blue (from the second image)
            'אדום': '#B23A48',    // Red (from the third image)
            'אופרייט': '#AAAAAA', // Off-White (placeholder, refine if needed)
            'כסף': '#C0C0C0',     // Silver
            'זהב': '#FFD700',     // Gold
        };
        return colors[colorName.toLowerCase()] || '#CCCCCC'; // ברירת מחדל לאפור
    };

    return (
        <div className="add-to-cart-container">
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: '', message: '' })}
                />
            )}
            <p>{totalQuantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
            <div className="price-container">
                <span className="original-price">
                    ${(selectedVariant?.price * 1.2).toFixed(2)}
                </span>
                <span className="discounted-price">
                    ${selectedVariant?.price.toFixed(2)}
                </span>
            </div>
            <div className="size-buttons-product-container">
                {variants.map(variant => (
                    <button
                        key={variant._id}
                        className={`size-button ${selectedVariant && selectedVariant._id === variant._id ? 'selected' : ''}`}
                        onClick={() => setSelectedVariant(variant)}
                    >
                        {variant.size}
                    </button>
                ))}
            </div>
            {selectedVariant && (
                <div className="color-buttons-product-container">
                    {selectedVariant.colors.map(color => (
                        <button
                            key={color.name}
                            className={`color-button ${selectedColor === color.name ? 'selected' : ''}`}
                            onClick={() => setSelectedColor(color.name)}
                            style={{ backgroundColor: getColorCode(color.name) }}
                            aria-label={color.name} // נגישות
                            title={color.name} // Tooltip
                        >
                            {/* אין טקסט */}
                        </button>
                    ))}
                </div>
            )}
            <button className="add-to-cart-button" onClick={handleAddToCart} disabled={!selectedVariant || totalQuantity === 0}>
                <FiShoppingCart />
                Add to Cart
            </button>
        </div>
    );
};

export default AddToCartButton;
