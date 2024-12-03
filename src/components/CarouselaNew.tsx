// components/CarouselComponent.tsx

import React, { FC, useEffect, useState } from 'react';
import { Carousel } from 'flowbite-react';
import { getCarouselImages } from '../services/carousela';
import './Carousel.scss';

const CarouselNew: FC = () => {
    const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
        fetchCarouselImages();
    }, []);

    const fetchCarouselImages = async () => {
        try {
            const data = await getCarouselImages();
            setImages(data);
        } catch (error) {
            console.error('Error fetching carousel images:', error);
        }
    };

    return (
        <div className="custom-carousel">
            <Carousel pauseOnHover>
                {images.map((image) => (
                    <img
                        key={image._id}
                        src={image.url}
                        alt={image.alt}
                        className="carousel-image desktop-image"
                    />
                ))}
            </Carousel>
        </div>
    );
};

export default CarouselNew;
