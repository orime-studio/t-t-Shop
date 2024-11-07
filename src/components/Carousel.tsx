import React, { FC } from 'react';
import { Carousel } from 'flowbite-react';
import './Carousel.scss';

const CarouselComponent: FC = () => {
    return (
        <div className="custom-carousel">
            <Carousel pauseOnHover>
                <img
                    src="/img/Brown & White Fashion Photo Collage New Collection Facebook Cover (2400 x 1000 px).png"
                    alt="Elegant Dresses Cover 1"
                    className="carousel-image desktop-image"
                />
                <img
                    src="/img/banner-2.png"
                    alt="Second Image for Desktop"
                    className="carousel-image desktop-image"
                />
            </Carousel>
        </div>
    );
};

export default CarouselComponent;
