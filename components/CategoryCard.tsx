
import React from 'react';
import { CategoryInfo } from '../types';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CategoryCardProps {
  category: CategoryInfo;
  onSelect: (category: CategoryInfo) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(category)}
      className="bg-gradient-to-br from-green-50 to-beige-100 dark:from-gray-700 dark:to-gray-800 hover:from-green-100 hover:to-beige-200 dark:hover:from-gray-600 dark:hover:to-gray-700 border border-green-200 dark:border-gray-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:ring-opacity-75 w-full text-left"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200">{category.title}</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">{category.description}</p>
        </div>
        <ChevronRightIcon className="w-8 h-8 text-green-600 dark:text-green-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors" />
      </div>
    </button>
  );
};

export default CategoryCard;
