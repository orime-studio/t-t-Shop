import Articles from './Articles';
import Categories from './Categories';
import MainArticle from './MainArticle';
import MainBanner from './MainBanner';
import './MainPage.scss';
import Bestsellers from './ProductsLimited';

const MainPage = () => {
    return (
        <div className="main-page-container">
            <MainBanner />
            <Categories />
            <Articles />
           <MainArticle />
         <Bestsellers />
       
        </div>
    );
};

export default MainPage;