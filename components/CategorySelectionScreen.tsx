
import React from 'react';
import { CategoryInfo } from '../types';
import CategoryCard from './CategoryCard';

interface CategorySelectionScreenProps {
  categories: CategoryInfo[];
  onSelectCategory: (category: CategoryInfo) => void;
}

const CategorySelectionScreen: React.FC<CategorySelectionScreenProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-semibold text-center text-green-700 dark:text-green-300 mb-8">Choose Your Memorization Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} onSelect={onSelectCategory} />
        ))}
      </div>
    </div>
  );
};

export default CategorySelectionScreen;
