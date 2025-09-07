import React from "react";
import { BookList } from "../../components/books";

export const BooksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Catalog</h1>
          <p className="mt-2 text-gray-600">
            Discover your next great read from our extensive collection of
            books.
          </p>
        </div>

        <BookList />
      </div>
    </div>
  );
};
