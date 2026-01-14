import { useState, useEffect } from 'react';
import { sampleProducts } from '../data/products';
import { API_CONFIG } from '../config/apiConfig';

export const useProductsCatalog = (user) => {
  const [products, setProducts] = useState(sampleProducts);
  const [heroSlides, setHeroSlides] = useState([
    { image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop" },
    { image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=500&fit=crop" },
    { image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop" }
  ]);

  const fetchProductsByCategory = async (categoryName, userPhone) => {
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.erp_api.item_api.get_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({
          page: 1,
          page_size: 20,
          mobile_no: userPhone,
          brand: 'Gbru',
          subcategory: categoryName
        })
      });
      const data = await response.json();
      if (data && data.message && data.message.data && data.message.data.data) {
        const categoryProducts = data.message.data.data.map((item, index) => ({
          id: item.name || index,
          name: item.item_name || item.name,
          price: item.standard_rate || item.price || 0,
          originalPrice: item.mrp_rate || item.original_price,
          image: item.image || 'https://via.placeholder.com/300x300',
          category: categoryName,
          rating: 4.5,
          reviews: 100,
          featured: false,
          bestSeller: false
        }));
        setProducts(categoryProducts);
      } else {
        setProducts(sampleProducts);
      }
    } catch (error) {
      setProducts(sampleProducts);
    }
  };

  const fetchBannersFromAPI = async () => {
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.erp_api.banner.banner_home_top_api.get_home_banner_top`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({ page: 1, page_size: 10 })
      });
      const data = await response.json();
      if (data && data.message && data.message.data && data.message.data.data) {
        const apiBanners = data.message.data.data.map(banner => ({
          image: banner.image_path
        }));
        setHeroSlides(apiBanners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBannersFromAPI();
    } else {
      setHeroSlides([
        { image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop" },
        { image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=500&fit=crop" },
        { image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop" }
      ]);
    }
  }, [user]);

  return {
    products,
    setProducts,
    heroSlides,
    fetchProductsByCategory
  };
};
