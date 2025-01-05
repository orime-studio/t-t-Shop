import Products from '../Products';
import Articles from './Articles';
import Categories from './Categories';
import MainArticle from './MainArticle';
import MainBanner from './MainBanner';
import './MainPage.scss';
import ProductsLimited from './ProductsLimited';

const MainPage = () => {
    return (
        <div className="main-page-container">
            <MainBanner />
            <Categories />
            <Articles />
           <MainArticle />
         <ProductsLimited />
       
        </div>
    );
};

export default MainPage;