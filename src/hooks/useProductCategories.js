import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/apiConfig';

export const useProductCategories = (user) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    try {
      const savedCategory = localStorage.getItem('selectedCategory');
      return savedCategory || null;
    } catch {
      return null;
    }
  });

  const FILTER_CATEGORIES = true;

  const fetchCategoriesFromAPI = async () => {
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.erp_api.subcategory_api.get_brand_subcategories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({ page: 1, page_size: 200, brand_id: 'Gbru' })
      });
      const data = await response.json();
      if (data && data.message && data.message.data && data.message.data.data) {
        let apiCategories;
        
        if (FILTER_CATEGORIES) {
          const allowedSubcategories = [
            'Flat Submersible Cable', 'Aluminium Service Cable', 'Flexible Cables'
          ];
          
          apiCategories = data.message.data.data
            .filter(category => allowedSubcategories.includes(category.sub_cat_id))
            .map(category => ({
              id: category.sub_cat_id,
              name: category.subcategory_name,
              image: category.image,
              category: category.category
            }));
        } else {
          apiCategories = data.message.data.data.map(category => ({
            id: category.sub_cat_id,
            name: category.subcategory_name,
            image: category.image,
            category: category.category
          }));
        }
        
        setCategories(apiCategories);
        
        if (!selectedCategory && apiCategories.length > 0) {
          setSelectedCategory(apiCategories[0].name);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem('selectedCategory', selectedCategory);
    } else {
      localStorage.removeItem('selectedCategory');
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (user) {
      fetchCategoriesFromAPI();
    } else {
      setCategories([]);
    }
  }, [user]);

  return {
    categories,
    selectedCategory,
    setSelectedCategory
  };
};
