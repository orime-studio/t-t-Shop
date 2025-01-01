import { FC, useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import './AddToCartButton.scss';
import { AddToCartButtonProps, IVariant } from '../@Types/productType';
import useCart from '../hooks/useCart';
import dialogs from '../ui/dialogs';
import { useAuth } from '../hooks/useAuth';

const AddToCartButton: FC<AddToCartButtonProps> = ({ productId, variants, title, image }) => {
    const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(variants[0] || null);
    const [selectedColor, setSelectedColor] = useState<string | null>(selectedVariant?.colors[0]?.name || null);
    const { addToCart } = useCart();
    const { isLoggedIn } = useAuth();

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

                dialogs.success(
                    "Product Added",
                    `<div style="display: flex; align-items: center;">
                        <img src="${image.url}" alt="${title}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;" />
                        <div>
                            <p>${title} has been added to your cart.</p>
                        </div>
                    </div>`
                );
            } catch (error) {
                console.error("Failed to add product to cart:", error);
                dialogs.error("Error", "Failed to add the product to your cart.");
            }
        } else {
            console.error("No variant or color selected");
        }
    };

    const getColorCode = (colorName: string) => {
        const colors: { [key: string]: string } = {
            'בז\'': '#d1b69b',   // Beige
            'חום': '#9b694b',    // Brown
            'שחור': '#16140f',   // Black
            'לבן': '#FFFFFF',    // White
            'אפור': '#CCCCCC',    // Gray
            // הוסיפי עוד צבעים לפי הצורך
        };
        return colors[colorName.toLowerCase()] || '#CCCCCC'; // ברירת מחדל לאפור
    };

    return (
        <div className="add-to-cart-container">
            <p>{totalQuantity > 0 ? 'במלאי' : 'אזל מהמלאי'}</p>
            <div className="price-container" style={{ marginBottom: '20px', marginTop: '15px' }}>
                <span className="original-price" style={{ marginRight: '10px' }}>
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
                        >
                            {/* אין טקסט */}
                        </button>
                    ))}
                </div>
            )}
            <button className="add-to-cart-button" onClick={handleAddToCart} disabled={!selectedVariant || totalQuantity === 0}>
                <FiShoppingCart />
                הוסף לעגלה
            </button>
        </div>
    );
};

export default AddToCartButton;
