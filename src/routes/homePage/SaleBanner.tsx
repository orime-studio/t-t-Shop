import React from 'react';
import { Link } from 'react-router-dom';
import './SaleBanner.scss';

const SaleBanner = () => {
  return (
    <div className="sale-banner-container">
      <div className="sale-banner-content">
        <h2 className="sale-banner-title">It's Cold Outside</h2>
        <p className="sale-banner-description">Winter Sale <br/> 20% Off </p>
        <div className="sale-banner-buttons">
          <Link to="/products/?category=Coats" className="sale-banner-button">SHOP OUTERWEAR</Link>
          <Link to="/products/?category=Jacket" className="sale-banner-button">SHOP TOPS</Link>
        </div>
      </div>
    </div>
  );
};

export default SaleBanner;
