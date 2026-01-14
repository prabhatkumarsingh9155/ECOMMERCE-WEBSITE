import React from 'react';
import './Categories.css';

const Categories = ({ categories, navigateTo, onCategorySelect, selectedCategory }) => {
  // Debug logging
  console.log('Categories received:', categories);
  
  // Fallback hardcoded categories when user is not logged in
  const hardcodedCategories = [
    { id: 'electronics', name: 'Electronics', subcategory_name: 'Electronics', color: '#10b981', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop' },
    { id: 'solar', name: 'Solar', subcategory_name: 'Solar', color: '#f59e0b', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop' },
    { id: 'tools', name: 'Tools', subcategory_name: 'Tools', color: '#3b82f6', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=200&fit=crop' },
    { id: 'hardware', name: 'Hardware', subcategory_name: 'Hardware', color: '#ef4444', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop' }
  ];

  // Temporary: Force all API categories for testing
  const apiCategories = [
    { id: 'flat-cable', name: 'Flat Submersible Cable', subcategory_name: 'Flat Submersible Cable', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/0d823b70-07fc-450a-b3ec-4a45044c0bc7_14102023040237.png' },
    { id: 'aluminium-cable', name: 'Aluminium Service Cable', subcategory_name: 'Aluminium Service Cable', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/c454c2e1-f000-467c-b918-c6d998089321_25012024112249.png' },
    { id: 'flexible-cables', name: 'Flexible Cables', subcategory_name: 'Flexible Cables', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/ee918dfd-1313-46b2-be21-5814021e03cf_11102023040829.png' },
    { id: 'winding-wires', name: 'Winding Wires', subcategory_name: 'Winding Wires', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/29afe494-1adb-4768-88a6-7be334c8298a_11102023041118.png' },
    { id: 'cctv-cables', name: 'CCTV Cables', subcategory_name: 'CCTV Cables', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/65134910-4d8d-4501-97c4-68bbaa602a36_11102023040804.png' },
    { id: 'telephone-cables', name: 'Telephone Cables', subcategory_name: 'Telephone Cables', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/67bcfa6b-6fbe-41d3-b456-c598bee76b3e_11102023040905.png' },
    { id: 'lan-cables', name: 'Lan Cables', subcategory_name: 'Lan Cables', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/aac99476-25cf-4faf-9a27-8c54feea056d_11102023041128.png' },
    { id: 'optic-fiber', name: 'Optic Fiber Cables', subcategory_name: 'Optic Fiber Cables', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/55dda5ef-bda2-4d96-988e-ede3cde8d51a_11102023041135.png' },
    { id: 'coaxial-cables', name: 'Co-Axial Cables', subcategory_name: 'Co-Axial Cables', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/f7e3c339-1a5c-48c8-bad1-aa5411c91b4d_11102023041438.png' },
    { id: 'speaker-cables', name: 'Speaker Cables', subcategory_name: 'Speaker Cables', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/000f1bcb-cd3b-4cd5-8f29-6acef79af09d_11102023041449.png' },
    { id: 'solar-cables', name: 'Solar Cables', subcategory_name: 'Solar Cables', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/a1337b4d-e55e-4412-ade2-986e9d70a275_11102023041624.png' },
    { id: 'auto-cable', name: 'Auto (Battery) Cable', subcategory_name: 'Auto (Battery) Cable', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/71a3fced-dfea-4b50-b8b9-303f26b58ce8_11102023041636.png' },
    { id: 'other', name: 'Other', subcategory_name: 'Other', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/b9bc1486-1bc2-48fc-bca4-c047610bf3fe_11102023055401.png' },
    { id: 'capacitor', name: 'Capacitor', subcategory_name: 'Capacitor', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/d6913def-509f-45e9-b893-f937a4f4f981_11102023055339.png' },
    { id: 'kitkat', name: 'KitKat', subcategory_name: 'KitKat', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/a2e32139-74f6-4fb7-a1e8-9328c9aa88e6_11102023055421.png' },
    { id: 'changeover', name: 'Changeover', subcategory_name: 'Changeover', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/b3611e1d-fa2e-4ae6-a9e5-05c7fbe34f3f_11102023055442.png' },
    { id: 'dp-tp-switch', name: 'DP/TP Switch', subcategory_name: 'DP/TP Switch', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/f5449a0c-4e65-4c31-9273-f74f5fafb803_11102023055511.png' },
    { id: 'main-switch', name: 'Main Switch', subcategory_name: 'Main Switch', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/04bc1abe-5b89-41e0-863e-f4c7f029d709_11102023055539.png' },
    { id: 'mcb', name: 'MCB', subcategory_name: 'MCB', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/ff3b5d4d-0acc-48b6-8dea-d9547749a88d_11102023055558.png' },
    { id: 'bus-bar', name: 'Bus Bar', subcategory_name: 'Bus Bar', image: 'https://storage.googleapis.com/shoption-cdn-bucket/uploads/Shoption_subcategory/44e96fc7-991f-4ad6-bd92-a8c590666b9d_11102023055618.png' }
  ];
  
  // Use API categories if available, otherwise hardcoded
  const displayCategories = categories.length > 0 ? categories : hardcodedCategories;
  console.log('Display categories:', displayCategories);
  
  // Generate random colors for API categories
  const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];
  
  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Category</h2>
        </div>
        <div className="categories-grid" style={{ marginTop: '0.5rem' }}>
          {displayCategories.map((category, index) => (
            <div key={category.id || index} className="category-item">
              <button
                className={`category-card ${selectedCategory === (category.subcategory_name || category.name) ? 'active' : ''}`}
                style={{ 
                  '--category-color': category.color || colors[index % colors.length],
                  backgroundImage: category.image ? `url(${category.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={() => {
                  const categoryName = category.subcategory_name || category.name;
                  console.log('Category clicked:', categoryName);
                  if (onCategorySelect) {
                    onCategorySelect(categoryName);
                  }
                  navigateTo('home', null, categoryName);
                }}
              >
                {category.image && <div className="category-overlay"></div>}
              </button>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;