import React, { useEffect, useState } from 'react';
import './Home.css';
import Categories from '../Categories/Categories';
import FeaturedProducts from '../FeaturedProducts/FeaturedProducts';
import TrustGallery from '../TrustGallery/TrustGallery';
import BestSeller from '../BestSeller';

const Home = ({ products, categories, heroSlides, addToCart, navigateTo, user, selectedCategory, userDetails, fetchCartCount }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCategorySelect = (categoryName) => {
    navigateTo('home', null, categoryName);
  };

  useEffect(() => {
    if (selectedCategory) {
      const categoryProducts = products.filter(p => p.category === selectedCategory);
      setFeaturedProducts(categoryProducts.slice(0, 4));
    } else {
      setFeaturedProducts(products.filter(p => p.featured));
    }
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [products, selectedCategory, heroSlides.length]);

  // Trigger refresh when component becomes visible
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-carousel">
          {heroSlides.map((slide, index) => (
            <div 
              key={index} 
              className={`hero-slide ${
                index === currentSlide ? 'active' : 
                index < currentSlide ? 'prev' : ''
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
            </div>
          ))}
          
          <div className="carousel-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          
          <button 
            className="carousel-btn prev" 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          >
            ‹
          </button>
          <button 
            className="carousel-btn next" 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          >
            ›
          </button>
        </div>
      </section>

      <Categories categories={categories} navigateTo={navigateTo} onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      <FeaturedProducts selectedCategory={selectedCategory} addToCart={addToCart} navigateTo={navigateTo} user={user} userDetails={userDetails} fetchCartCount={fetchCartCount} refreshTrigger={refreshTrigger} />
      <TrustGallery user={user} />
      <BestSeller addToCart={addToCart} navigateTo={navigateTo} user={user} products={products} userDetails={userDetails} fetchCartCount={fetchCartCount} />
    </div>
  );
};

export default Home;