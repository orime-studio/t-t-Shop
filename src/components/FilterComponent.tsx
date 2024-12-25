import { useEffect, useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { getAllProducts } from '../services/product-service';
import { IProduct } from '../@Types/productType';
import { FiFilter } from 'react-icons/fi'; 
import './FilterComponent.scss';

const Filter = () => {
    const { setMinPrice, setMaxPrice, setSelectedSizes, minPrice, maxPrice, selectedSizes } = useSearch();
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [isOpen, setIsOpen] = useState(false); // מצב לניהול הפתיחה/סגירה של הפילטר

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getAllProducts();
                // איסוף כל המידות
                const allSizesSet = new Set<string>();
                response.data.forEach((product: IProduct) => {
                    product.variants.forEach((variant) => {
                        allSizesSet.add(variant.size);
                    });
                });
                setAvailableSizes(Array.from(allSizesSet));

                // מציאת טווח המחירים
                const prices = response.data.flatMap((product: IProduct) =>
                    product.variants.map((variant) => variant.priceAddition)
                );
                const minPriceValue = Math.min(...prices);
                const maxPriceValue = Math.max(...prices);
                setPriceRange([minPriceValue, maxPriceValue]);

                // הגדרת ערכי ברירת המחדל של המחיר
                setMinPrice(minPriceValue);
                setMaxPrice(maxPriceValue);
            } catch (error) {
                console.error(error);
            }
        };

        fetchInitialData();
    }, []);

    return (
        <div className="filter-component">
            <button className="filter-toggle-button" onClick={() => setIsOpen(!isOpen)}>
                <FiFilter size={20} />
                Filter
            </button>
            {isOpen && (
                <div className="filters-container">
                    {/* פילטר מחיר */}
                    <div className="filter-section">
                        <h3>סנן לפי מחיר</h3>
                        <div className="slider-container">
                            <Slider
                                range
                                min={priceRange[0]}
                                max={priceRange[1]}
                                value={[minPrice, maxPrice]}
                                onChange={(values: [number, number]) => {
                                    setMinPrice(values[0]);
                                    setMaxPrice(values[1]);
                                }}
                            />
                        </div>
                        <div className="price-values">
                            <span>מינימום: {minPrice} ₪</span>
                            <span>מקסימום: {maxPrice} ₪</span>
                        </div>
                    </div>

                    {/* פילטר מידות */}
                    <div className="filter-section">
                        <h3>סנן לפי מידה</h3>
                        <div className="size-buttons-filter-container">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => {
                                        if (selectedSizes.includes(size)) {
                                            setSelectedSizes(selectedSizes.filter((s) => s !== size));
                                        } else {
                                            setSelectedSizes([...selectedSizes, size]);
                                        }
                                    }}
                                    className={`size-filter-button ${selectedSizes.includes(size) ? 'selected' : ''}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filter;
