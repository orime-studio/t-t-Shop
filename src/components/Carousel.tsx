import React, { useState, useEffect } from 'react';
import { Carousel } from 'flowbite-react';
import './Carousel.scss';

const CarouselComponent: React.FC = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // אפקט לבדיקת גודל המסך
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);  // אם המסך קטן מ-768px, נחשב כמובייל
        };

        // בדיקה בעת טעינת הרכיב
        handleResize();
        // מאזין לשינוי בגודל המסך
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize); // הסרה של המאזין בעת פירוק הרכיב
        };
    }, []);

    return (
        <div className="custom-carousel">
                <Carousel pauseOnHover>
                    <img
                        src="/img/Brown & White Fashion Photo Collage New Collection Facebook Cover (2400 x 1000 px).png"
                        alt="Elegant Dresses Cover 1"
                    />
                    <img
                        src="/img/banner-2.png"
                        alt="Second Image for Desktop"
                    />
                </Carousel>
            
        </div>
    );
};

export default CarouselComponent;
