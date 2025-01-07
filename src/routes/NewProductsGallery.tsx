// src/routes/NewProductsGallery.tsx
import React, { FC, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { IProduct, IVariant } from '../@Types/productType';
import { useSearch } from '../hooks/useSearch';
import { getAllProducts } from '../services/product-service';
import { useAuth } from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import Filter from '../components/FilterComponent';
import LatestArticles from './ArticleComponrnts/LatestArticle';
import Alert from '../components/Alert';
import './NewProductsGallery.scss';
import { FiPlus } from 'react-icons/fi';

const NewProductsGallery: FC = () => {
  // מצב לנתוני מוצרים / טעינה / שגיאה
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // פרמטרים לחיפוש/פילטר
  const { searchTerm, minPrice, maxPrice, selectedSizes } = useSearch();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  // מצב התראות (Alert)
  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // מיפוי של productId -> { selectedVariant, selectedColor }
  const [productSelections, setProductSelections] = useState<{
    [productId: string]: {
      variant: IVariant | null;
      color: string | null;
    };
  }>({});

  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  // הבאת מוצרים
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProducts({
          minPrice,
          maxPrice,
          sizes: selectedSizes,
          searchTerm,
          category,
        });
        const fetchedProducts: IProduct[] = res.data || [];
        setProducts(fetchedProducts);

        // אתחול בחירת וריאנט וצבע
        const initialSelections: {
          [productId: string]: { variant: IVariant | null; color: string | null };
        } = {};

        fetchedProducts.forEach((p) => {
          const firstVariant = p.variants[0] || null;
          const firstColor = firstVariant?.colors[0]?.name || null;
          initialSelections[p._id] = {
            variant: firstVariant,
            color: firstColor,
          };
        });

        setProductSelections(initialSelections);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [minPrice, maxPrice, selectedSizes, searchTerm, category]);

  // סגירת Alert אוטומטית
  const hideAlertAfterTimeout = () => {
    setTimeout(() => {
      setAlert({ show: false, type: 'success', message: '' });
    }, 3000);
  };

  // בחירת וריאנט
  const handleSelectVariant = (productId: string, variant: IVariant) => {
    setProductSelections((prev) => {
      const newSelections = { ...prev };
      const firstColor = variant.colors[0]?.name || null;
      newSelections[productId] = {
        variant,
        color: firstColor,
      };
      return newSelections;
    });
  };

  // בחירת צבע
  const handleSelectColor = (productId: string, color: string) => {
    setProductSelections((prev) => {
      const newSelections = { ...prev };
      newSelections[productId] = {
        ...newSelections[productId],
        color,
      };
      return newSelections;
    });
  };

  // מפת צבעים
  const getColorCode = (colorName: string) => {
    const colors: { [key: string]: string } = {
      "בז'": '#d1b69b',
      'חום': '#9b694b',
      'שחור': '#16140f',
      'לבן': '#FFFFFF',
      'אפור': '#CCCCCC',
      'ורוד עתיק': '#D2A4A1',
      'תכלת': '#A3D4E7',
      'אדום': '#B23A48',
      'אופרייט': '#AAAAAA',
      'כסף': '#C0C0C0',
      'זהב': '#FFD700',
    };
    return colors[colorName.toLowerCase()] || '#CCCCCC';
  };

  // הוספה לסל
  const handleAddToCart = async (product: IProduct) => {
    if (!isLoggedIn) {
      setAlert({
        show: true,
        type: 'warning',
        message: 'Please log in before adding to cart.',
      });
      hideAlertAfterTimeout();
      return;
    }

    const selection = productSelections[product._id];
    if (!selection || !selection.variant || !selection.color) {
      setAlert({
        show: true,
        type: 'warning',
        message: 'Please select a variant and color first.',
      });
      hideAlertAfterTimeout();
      return;
    }

    const totalQuantity = selection.variant.colors.reduce((sum, c) => sum + c.quantity, 0);
    if (totalQuantity === 0) {
      setAlert({
        show: true,
        type: 'warning',
        message: 'This item is out of stock.',
      });
      hideAlertAfterTimeout();
      return;
    }

    try {
      await addToCart(
        product._id,
        selection.variant._id,
        product.title,
        1,
        selection.variant.size,
        selection.variant.price,
        product.mainImage,
        selection.color
      );

      setAlert({
        show: true,
        type: 'success',
        message: `Product "${product.title}" added to cart!`,
      });
      hideAlertAfterTimeout();
    } catch (err) {
      console.error('Failed to add product to cart', err);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to add product to cart. Please try again.',
      });
      hideAlertAfterTimeout();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="new-gallery-wrapper">
      {/* פילטר */}
      <Filter />

      {/* כותרת (לא חובה) */}
      <h2 className="new-gallery-heading">Our Bestsellers</h2>

      {/* רשת מוצרים */}
      <div className="new-gallery-grid">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => {
            const { variant, color } = productSelections[product._id] || {};
            if (!variant) return null;

            const originalPrice = (variant.price * 1.2).toFixed(2);
            const discountedPrice = variant.price.toFixed(2);

            return (
              <div className="new-gallery-item" key={product._id}>
                {/* אזור התמונה */}
                <div className="new-gallery-image-container">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.mainImage.url}
                      alt={product.alt}
                      className="new-gallery-image"
                    />
                  </Link>
                  {/* כפתור Quick Add בהובר */}
                  <button
                    className="new-gallery-add-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    QUICK ADD
                    <FiPlus className="icon-plus" />
                  </button>
                </div>

                {/* כותרת + מחירים בשורה אחת */}
                <div className="new-gallery-title-row">
                  <h5 className="new-gallery-title">{product.title}</h5>
                  <div className="new-gallery-prices">
                    <span className="old-price">₪{originalPrice}</span>
                    <span className="new-price">₪{discountedPrice}</span>
                  </div>
                </div>

                {/* בחירת צבע */}
                <div className="new-gallery-colors">
                  <span className="label">Color</span>
                  <div className="color-buttons">
                    {variant.colors.map((c) => (
                      <button
                        key={c.name}
                        className={
                          'btn-color' + (c.name === color ? ' selected' : '')
                        }
                        style={{ backgroundColor: getColorCode(c.name) }}
                        onClick={() => handleSelectColor(product._id, c.name)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* בחירת מידה */}
                <div className="new-gallery-sizes">
                  <span className="label">Size</span>
                  <div className="size-buttons">
                    {product.variants.map((v) => (
                      <button
                        key={v._id}
                        className={
                          'btn-size' + (v._id === variant._id ? ' selected' : '')
                        }
                        onClick={() => handleSelectVariant(product._id, v)}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* מאמרים/כתבות אחרונים */}
      <LatestArticles />

      {/* הודעות Alert */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: 'success', message: '' })}
        />
      )}
    </div>
  );
};

export default NewProductsGallery;
