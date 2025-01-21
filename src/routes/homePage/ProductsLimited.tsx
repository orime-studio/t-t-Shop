import React, { FC, useEffect, useState } from 'react';
import { IProduct, IVariant } from '../../@Types/productType';
import { useSearchParams, Link } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import { getAllProducts } from '../../services/product-service';
import useCart from '../../hooks/useCart';
import { useAlert } from '../../contexts/AlertContext';
import Filter from '../../components/FilterComponent';
import LatestArticles from '../ArticleComponrnts/LatestArticle';
import { FiPlus } from 'react-icons/fi';
import './NewProductsGallery.scss';

// זהה ב-100% ל-NewProductsGallery המקורי, רק ששינינו את השם:
const FourProductsGallery: FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { searchTerm, minPrice, maxPrice, selectedSizes } = useSearch();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const [productSelections, setProductSelections] = useState<{
    [productId: string]: {
      variant: IVariant | null;
      color: string | null;
    };
  }>({});

  const { showAlert } = useAlert();
  const { addToCart } = useCart();

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

  const getColorCode = (colorName: string) => {
    const colors: { [key: string]: string } = {
      beige: '#d1b69b',
      brown: '#9b694b',
      black: '#16140f',
      white: '#FFFFFF',
      gray: '#CCCCCC',
      'antique pink': '#D2A4A1',
      'light blue': '#A3D4E7',
      red: '#B23A48',
      'off-white': '#AAAAAA',
      silver: '#C0C0C0',
      gold: '#FFD700',
    };
    return colors[colorName.toLowerCase()] || '#CCCCCC';
  };

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

  const handleAddToCart = async (product: IProduct) => {
    const selection = productSelections[product._id];
    if (!selection || !selection.variant || !selection.color) {
      showAlert('warning', 'Please select a size (variant) and color first.');
      return;
    }

    const selectedColorObj = selection.variant.colors.find(
      (c) => c.name === selection.color
    );
    if (!selectedColorObj || selectedColorObj.quantity === 0) {
      showAlert('warning', 'This item is out of stock in the selected size and color.');
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
      showAlert('success', `Product "${product.title}" added to cart!`);
    } catch (err) {
      console.error('Failed to add product to cart', err);
      showAlert('error', 'Failed to add product to cart. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // הנה החיתוך ל-4 מוצרים בלבד
  const fourProducts = products.slice(0, 4);

  return (
    <div className="new-gallery-wrapper">
     {/*  <Filter /> */}
      <h2 className="new-gallery-heading k">Our Bestsellers </h2>

      <div className="new-gallery-grid"> 
        {fourProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          fourProducts.map((product) => {
            const { variant, color } = productSelections[product._id] || {};
            if (!variant) return null;

            const originalPrice = (variant.price * 1.2).toFixed(2);
            const discountedPrice = variant.price.toFixed(2);

            return (
              <div className="new-gallery-item" key={product._id}>
                <div className="new-gallery-image-container">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.mainImage.url}
                      alt={product.alt}
                      className="new-gallery-image"
                    />
                  </Link>
                   <button
                   className="new-gallery-add-button"
                   onClick={() => handleAddToCart(product)}
                 >
                   <span className="button-text">QUICK ADD</span>
                   <FiPlus className="icon-plus" />
                 </button>
                </div>

                <div className="new-gallery-title-row">
                  <h5 className="new-gallery-title">{product.title}</h5>
                  <div className="new-gallery-prices">
                    <span className="old-price">${originalPrice}</span>
                    <span className="new-price">${discountedPrice}</span>
                  </div>
                </div>

                <div className="new-gallery-sizes">
                  <span className="label">Size: {variant.size}</span>
                  <div className="size-buttons">
                    {product.variants.map((v) => (
                      <button
                        key={v._id}
                        className={'btn-size' + (v._id === variant._id ? ' selected' : '')}
                        onClick={() => handleSelectVariant(product._id, v)}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="new-gallery-colors">
                  <span className="label">Color: {color}</span>
                  <div className="color-buttons">
                    {variant.colors.map((c) => (
                      <button
                        key={c.name}
                        className={'btn-color' + (c.name === color ? ' selected' : '')}
                        style={{ backgroundColor: getColorCode(c.name) }}
                        onClick={() => handleSelectColor(product._id, c.name)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default FourProductsGallery;
