import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.scss';

const Categories = () => {
  return (
    <div className="categories-container">
      <h2 className="categories-title">Shop by Category</h2>
      <div className="categories">
        <Link to="/?category=Bags" className="category">
          <img src="img/homePage/BAGS.png" alt="BAGS" />
          <h3 className="category-title">BAGS</h3>
        </Link>
        <Link to="/?category=Jacket" className="category">
          <img src="img/homePage/TOPS.png" alt="TOPS" />
          <h3 className="category-title">TOPS</h3>
        </Link>
        <Link to="/?category=Coats" className="category">
          <img src="img/homePage/OUTERWEAR.png" alt="OUTERWEAR" />
          <h3 className="category-title">OUTERWEAR</h3>
        </Link>
        <Link to="/?category=Shoes" className="category">
          <img src="img/homePage/SHOES.png" alt="SHOES" />
          <h3 className="category-title">SHOES</h3>
        </Link>
        <Link to="/?category=Jewelry" className="category category-jewelry">
          <img src="img/homePage/JEWELRY.png" alt="JEWELRY" />
          <h3 className="category-title">JEWELRY</h3>
        </Link>
      </div>
    </div>
  );
};

export default Categories;