import { Carousel } from 'flowbite-react';
import Articles from './Articles';
import Categories from './Categories';
import MainArticle from './MainArticle';
import MainBanner from './MainBanner';
import './MainPage.scss';
import FourProductsGallery from './ProductsLimited';
import Bestsellers from './ProductsLimited';
import CarouselComponent from '../../components/Carousel';

const MainPage = () => {
    return (
        <div className="main-page-container">
            <MainBanner />
            <Categories />
          
            
            <Articles />
           <MainArticle />
           <FourProductsGallery />
        
       
        </div>
    );
};

export default MainPage;