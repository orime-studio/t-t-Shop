import Articles from './Articles';
import Categories from './Categories';
import MainBanner from './MainBanner';
import './MainPage.scss';

const MainPage = () => {
    return (
        <div className="main-page-container">
            <MainBanner />
            <Categories />
            <Articles />
        </div>
    );
};

export default MainPage;