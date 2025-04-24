import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LuShoppingBag } from "react-icons/lu";
import Navbar from "../components/navbar.jsx";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/api/placeholder/150/150",
    joinDate: "April 2023",
    points: 250,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const booksPerPage = 12;

  // Categories - would ideally come from your API
  const categories = [
    { id: "all", name: "Semua" },
    { id: "programming", name: "Programming" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
    { id: "science", name: "Science" },
    { id: "fiction", name: "Fiction" },
  ];

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Using IT Bookstore API for demo - replace with your actual API
        const response = await axios.get("http://localhost:3000/api/books/");

        if (response.data && response.data.books) {
          // Add random price and category for demo filtering
          const booksWithDetails = response.data.books.map((book) => ({
            ...book,
            // Parse string price like "$20.99" to number 20.99
            numericPrice: book.price,
            // Assign random category for demo
            category:
              categories[
                Math.floor(Math.random() * (categories.length - 1)) + 1
              ].id,
          }));

          setBooks(booksWithDetails);
          setFilteredBooks(booksWithDetails);
          setTotalPages(Math.ceil(booksWithDetails.length / booksPerPage));
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  console.log(books);

  // Apply filters and search
  useEffect(() => {
    let results = [...books];

    // Filter by category
    if (activeCategory !== "all") {
      results = results.filter((book) => book.category === activeCategory);
    }

    // Filter by price
    results = results.filter(
      (book) =>
        book.numericPrice >= priceRange.min &&
        book.numericPrice <= priceRange.max
    );

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((book) =>
        book.title.toLowerCase().includes(query)
      );
    }

    // Sort results
    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => a.numericPrice - b.numericPrice);
        break;
      case "price-desc":
        results.sort((a, b) => b.numericPrice - a.numericPrice);
        break;
      case "title":
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        // Assuming already sorted by newest in the API
        break;
    }

    setFilteredBooks(results);
    setTotalPages(Math.ceil(results.length / booksPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeCategory, searchQuery, priceRange, sortBy, books]);

  // Get current page books
  const getCurrentBooks = () => {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  };

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange({
      ...priceRange,
      [name]: Number(value),
    });
  };

  // Toggle mobile filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Lakukan logout dengan metode yang sesuai (misalnya, dengan Supabase, Firebase, dll.)
    setUser(null);
    // Redirect ke halaman login setelah logout
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Katalog Buku
              </h1>
              <p className="text-lg text-blue-100 mb-8">
                Temukan berbagai macam buku yang sesuai dengan minat dan
                kebutuhan Anda
              </p>

              {/* Search box */}
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Cari judul buku atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-100"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Mobile filter toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={toggleFilter}
              className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Filter & Sort</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar filters - hidden on mobile until toggled */}
            <aside
              className={`${
                isFilterOpen ? "block" : "hidden"
              } md:block md:w-64 lg:w-72 bg-white rounded-lg shadow-md p-4 md:mr-6 mb-6 md:mb-0 sticky top-24 h-fit`}
            >
              <div className="md:hidden flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button onClick={toggleFilter} className="text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Kategori</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setActiveCategory(category.id)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeCategory === category.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Rentang Harga
                </h3>
                <div className="flex space-x-4 mb-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Min ($)
                    </label>
                    <input
                      type="number"
                      name="min"
                      value={priceRange.min}
                      onChange={handlePriceChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Max ($)
                    </label>
                    <input
                      type="number"
                      name="max"
                      value={priceRange.max}
                      onChange={handlePriceChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$100+</span>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Urutkan Berdasarkan
                </h3>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Terbaru</option>
                  <option value="price-asc">Harga: Rendah ke Tinggi</option>
                  <option value="price-desc">Harga: Tinggi ke Rendah</option>
                  <option value="title">Judul</option>
                </select>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {/* Results info & sort (desktop) */}
              <div className="hidden md:flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Menampilkan {filteredBooks.length} buku
                  {activeCategory !== "all" &&
                  categories.find((cat) => cat.id === activeCategory)
                    ? ` dalam kategori ${
                        categories.find((cat) => cat.id === activeCategory).name
                      }`
                    : ""}
                </p>
                <div className="flex items-center">
                  <label className="text-gray-600 mr-2">Urutkan:</label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-1.5"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Terbaru</option>
                    <option value="price-asc">Harga: Rendah ke Tinggi</option>
                    <option value="price-desc">Harga: Tinggi ke Rendah</option>
                    <option value="title">Judul</option>
                  </select>
                </div>
              </div>

              {/* Error state */}
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                  <p>{error}</p>
                </div>
              )}

              {/* Loading state */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {/* Empty state */}
                  {filteredBooks.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Tidak ada hasil ditemukan
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Tidak ada buku yang sesuai dengan filter pencarian Anda.
                        Coba ubah filter atau kata kunci pencarian.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategory("all");
                          setPriceRange({ min: 0, max: 100 });
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Reset semua filter
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Books grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {getCurrentBooks().map((book) => (
                          <div
                            key={book.id}
                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                          >
                            <Link to={`/book/${book.id}`}>
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={book.imageUrl}
                                  alt={book.title}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                              </div>
                              <div className="p-4">
                                <h3
                                  className="font-medium text-gray-800 mb-1 line-clamp-1"
                                  title={book.title}
                                >
                                  {book.title}
                                </h3>

                                <div className="flex justify-between items-center">
                                  <span className="text-blue-600 font-medium">
                                    {book.price}
                                  </span>
                                  <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                    {categories.find(
                                      (cat) => cat.id === book.category
                                    )?.name || "General"}
                                  </button>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                          <div className="flex space-x-1">
                            {/* Previous page button */}
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`px-3 py-1 rounded-md ${
                                currentPage === 1
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>

                            {/* Page numbers */}
                            {[...Array(totalPages)].map((_, i) => {
                              // Show always first page, last page, current page and one page before and after current
                              if (
                                i === 0 ||
                                i === totalPages - 1 ||
                                i === currentPage - 1 ||
                                i === currentPage - 2 ||
                                i === currentPage
                              ) {
                                return (
                                  <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1 rounded-md ${
                                      currentPage === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-200"
                                    }`}
                                  >
                                    {i + 1}
                                  </button>
                                );
                              }

                              // Show ellipsis for gaps
                              if (
                                (i === 1 && currentPage > 3) ||
                                (i === totalPages - 2 &&
                                  currentPage < totalPages - 2)
                              ) {
                                return (
                                  <span key={i} className="px-3 py-1">
                                    ...
                                  </span>
                                );
                              }

                              return null;
                            })}

                            {/* Next page button */}
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`px-3 py-1 rounded-md ${
                                currentPage === totalPages
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Toko Buku</h3>
              <p className="text-gray-300">
                Temukan buku terbaik untuk menemani hari-harimu.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Link Cepat</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/catalog"
                    className="text-gray-300 hover:text-white"
                  >
                    Katalog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/new-releases"
                    className="text-gray-300 hover:text-white"
                  >
                    Baru Rilis
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bestsellers"
                    className="text-gray-300 hover:text-white"
                  >
                    Bestseller
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white">
                    Tentang Kami
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Email: info@tokobuku.com</li>
                <li>Telepon: (021) 123-4567</li>
                <li>Alamat: Jl. Buku No. 123, Jakarta</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Toko Buku. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookList;
