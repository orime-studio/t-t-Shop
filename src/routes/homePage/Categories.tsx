import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.scss';

const Categories = () => {
  return (
    <div className="categories-container">
      <h2 className="categories-title">Shop by Category</h2>
      <div className="categories">
        <Link to="/category/bags" className="category">
          <img src="img/homePage/BAGS.jpg" alt="BAGS" />
          <h3 className="category-title">BAGS</h3>
        </Link>
        <Link to="/category/tops" className="category">
          <img src="img/homePage/TOPS.jpg" alt="TOPS" />
          <h3 className="category-title">TOPS</h3>
        </Link>
        <Link to="/category/outerwear" className="category">
          <img src="img/homePage/OUTERWEAR.jpg" alt="OUTERWEAR" />
          <h3 className="category-title">OUTERWEAR</h3>
        </Link>
        <Link to="/category/shoes" className="category">
          <img src="img/homePage/SHOES.jpg" alt="SHOES" />
          <h3 className="category-title">SHOES</h3>
        </Link>
        <Link to="/category/jewelry" className="category">
          <img src="img/homePage/JEWELRY.jpg" alt="JEWELRY" />
          <h3 className="category-title">JEWELRY</h3>
        </Link>
      </div>
    </div>
  );
};

export default Categories;