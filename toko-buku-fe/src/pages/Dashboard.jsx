import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/api/placeholder/150/150",
    joinDate: "April 2023",
    points: 250,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In a real app, these would be separate API calls or a single call with all user data
        // Using IT Bookstore API for demo purposes
        const bookResponse = await axios.get(
          "https://api.itbook.store/1.0/new"
        );

        if (bookResponse.data && bookResponse.data.books) {
          const books = bookResponse.data.books;

          // Simulate different user data with the same book data
          setRecentOrders([
            {
              id: "ORD-1234",
              date: "2025-04-15",
              status: "Delivered",
              items: books.slice(0, 2),
              total: 54.98,
            },
            {
              id: "ORD-1235",
              date: "2025-04-03",
              status: "Shipped",
              items: books.slice(2, 3),
              total: 29.99,
            },
            {
              id: "ORD-1236",
              date: "2025-03-22",
              status: "Processing",
              items: books.slice(3, 5),
              total: 62.5,
            },
          ]);

          setWishlist(
            books.slice(5, 8).map((book) => ({
              ...book,
              dateAdded: "2025-04-10",
            }))
          );

          setCurrentlyReading(
            books.slice(8, 11).map((book) => ({
              ...book,
              progress: Math.floor(Math.random() * 100),
              startDate: "2025-04-01",
            }))
          );

          setRecommendations(books.slice(11, 15));

          setReviews([
            {
              id: 1,
              bookId: books[0].isbn13,
              bookTitle: books[0].title,
              bookImage: books[0].image,
              rating: 4.5,
              content:
                "A fantastic book that covers all the essentials. Highly recommended for beginners.",
              date: "2025-03-20",
            },
            {
              id: 2,
              bookId: books[2].isbn13,
              bookTitle: books[2].title,
              bookImage: books[2].image,
              rating: 3.0,
              content:
                "Good information but could be more detailed in some chapters.",
              date: "2025-02-15",
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Welcome section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">
                Selamat datang kembali, {profile.name}!
              </h2>
              <p>
                Anda memiliki {profile.points} poin reward. Lanjutkan membaca
                untuk mendapatkan lebih banyak poin.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm mb-1">Pesanan</h3>
                <p className="font-semibold text-2xl">{recentOrders.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm mb-1">Wishlist</h3>
                <p className="font-semibold text-2xl">{wishlist.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm mb-1">Ulasan</h3>
                <p className="font-semibold text-2xl">{reviews.length}</p>
              </div>
            </div>

            {/* Currently reading */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Sedang Dibaca
                </h2>
                <Link
                  to="/reading"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Lihat semua 
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentlyReading.slice(0, 3).map((book) => (
                  <div
                    key={book.isbn13}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-16 h-20 object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                        <div className="mt-2">
                          <div className="bg-gray-200 h-2 rounded-full w-full">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {book.progress}% selesai
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Pesanan Terbaru
                </h2>
                <Link
                  to="/orders"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Lihat semua
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                            {order.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium 
                              ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/order/${order.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Rekomendasi Untuk Anda
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendations.map((book) => (
                  <Link
                    to={`/book/${book.isbn13}`}
                    key={book.isbn13}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3">
                      <h3
                        className="font-medium text-gray-800 text-sm mb-1 line-clamp-2"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-blue-600 text-sm font-medium">
                        {book.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Riwayat Pesanan
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produk
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                            {order.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <img
                                src={order.items[0].image}
                                alt={order.items[0].title}
                                className="h-10 w-8 object-cover mr-2"
                              />
                              <span>
                                {order.items.length > 1
                                  ? `${order.items[0].title} +${
                                      order.items.length - 1
                                    } lainnya`
                                  : order.items[0].title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium 
                              ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/order/${order.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-600">Anda belum memiliki pesanan.</p>
                </div>
              )}
            </div>
          </div>
        );

      case "wishlist":
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Wishlist Saya
            </h2>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((book) => (
                  <div
                    key={book.isbn13}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col"
                  >
                    <Link to={`/book/${book.isbn13}`} className="flex-shrink-0">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-40 object-cover"
                      />
                    </Link>
                    <div className="p-4 flex-grow flex flex-col">
                      <Link to={`/book/${book.isbn13}`} className="mb-2">
                        <h3
                          className="font-medium text-gray-800 mb-1 line-clamp-1"
                          title={book.title}
                        >
                          {book.title}
                        </h3>
                        <p
                          className="text-sm text-gray-500 line-clamp-2 mb-2"
                          title={book.subtitle}
                        >
                          {book.subtitle}
                        </p>
                      </Link>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-blue-600 font-medium">
                          {book.price}
                        </span>
                        <p className="text-xs text-gray-500">
                          Ditambahkan {formatDate(book.dateAdded)}
                        </p>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button className="bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700 transition">
                          Tambah ke Keranjang
                        </button>
                        <button className="border border-gray-300 text-gray-600 rounded-md py-2 text-sm font-medium hover:bg-gray-50 transition">
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Wishlist Anda kosong
                </h3>
                <p className="text-gray-600 mb-4">
                  Tambahkan buku ke wishlist untuk menyimpannya untuk nanti.
                </p>
                <Link
                  to="/catalog"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Jelajahi Katalog
                </Link>
              </div>
            )}
          </div>
        );

      case "reading":
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Sedang Dibaca
            </h2>
            {currentlyReading.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {currentlyReading.map((book) => (
                  <div
                    key={book.isbn13}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full sm:w-24 h-32 object-cover rounded mb-4 sm:mb-0"
                      />
                      <div className="sm:ml-6 flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-800 mb-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {book.subtitle}
                            </p>
                          </div>
                          <div className="flex items-center mt-2 sm:mt-0">
                            <span className="text-xs text-gray-500 mr-2">
                              Mulai: {formatDate(book.startDate)}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{book.progress}%</span>
                          </div>
                          <div className="bg-gray-200 h-2 rounded-full">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                            Lanjutkan Membaca
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Belum ada buku yang dibaca
                </h3>
                <p className="text-gray-600 mb-4">
                  Mulai membaca buku digital kami untuk mendapatkan pengalaman
                  membaca yang menyenangkan.
                </p>
                <Link
                  to="/catalog"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Temukan Buku
                </Link>
              </div>
            )}
          </div>
        );

      case "reviews":
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Ulasan Saya
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <Link
                        to={`/book/${review.bookId}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={review.bookImage}
                          alt={review.bookTitle}
                          className="w-full sm:w-24 h-32 object-cover rounded mb-4 sm:mb-0"
                        />
                      </Link>
                      <div className="sm:ml-6 flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                          <Link to={`/book/${review.bookId}`}>
                            <h3 className="font-medium text-gray-800 mb-1">
                              {review.bookTitle}
                            </h3>
                          </Link>
                          <span className="text-xs text-gray-500">
                            Ditulis pada {formatDate(review.date)}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill={
                                  i < Math.floor(review.rating)
                                    ? "currentColor"
                                    : "none"
                                }
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {review.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{review.content}</p>
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Belum ada ulasan
                </h3>
                <p className="text-gray-600 mb-4">
                  Beri tahu pembaca lain tentang pendapat Anda tentang buku yang
                  telah Anda baca.
                </p>
                <Link
                  to="/catalog"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mulai Menulis Ulasan
                </Link>
              </div>
            )}
          </div>
        );

      case "profile":
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Profil Saya
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="md:flex">
                {/* Profile sidebar */}
                <div className="p-6 text-center md:w-1/3 md:border-r border-gray-100">
                  <div className="relative inline-block">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4"
                    />
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 100-6 3 3 0 000 6z"
                        />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Bergabung sejak: {profile.joinDate}
                  </p>
                  <p className="text-sm text-gray-800 mt-4">
                    Poin: {profile.points}
                  </p>
                  <button className="mt-6 text-sm text-blue-600 hover:text-blue-800">
                    Edit Profil
                  </button>
                </div>

                {/* Profile Details */}
                <div className="p-6 flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Rincian Profil
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-gray-500 text-sm mb-1">Nama</h3>
                      <p className="font-medium text-gray-800">
                        {profile.name}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-gray-500 text-sm mb-1">Email</h3>
                      <p className="font-medium text-gray-800">
                        {profile.email}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-gray-500 text-sm mb-1">
                        Poin Reward
                      </h3>
                      <p className="font-medium text-gray-800">
                        {profile.points}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-gray-500 text-sm mb-1">
                        Bergabung Sejak
                      </h3>
                      <p className="font-medium text-gray-800">
                        {profile.joinDate}
                      </p>
                    </div>
                  </div>

                  {/* Update Password */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Ubah Password
                    </h3>
                    <form className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <input
                          type="password"
                          placeholder="Password Lama"
                          className="bg-gray-100 border border-gray-300 rounded-lg p-3 w-full sm:w-1/2"
                        />
                        <input
                          type="password"
                          placeholder="Password Baru"
                          className="bg-gray-100 border border-gray-300 rounded-lg p-3 w-full sm:w-1/2"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                      >
                        Simpan Perubahan
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Tab not found!</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 p-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <div className="space-y-4">
          <button
            className={`block w-full text-left py-2 px-4 rounded-md ${
              activeTab === "overview" ? "bg-blue-600" : "bg-gray-700"
            } hover:bg-blue-600`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`block w-full text-left py-2 px-4 rounded-md ${
              activeTab === "orders" ? "bg-blue-600" : "bg-gray-700"
            } hover:bg-blue-600`}
            onClick={() => setActiveTab("orders")}
          >
            Riwayat Pesanan
          </button>
          <button
            className={`block w-full text-left py-2 px-4 rounded-md ${
              activeTab === "wishlist" ? "bg-blue-600" : "bg-gray-700"
            } hover:bg-blue-600`}
            onClick={() => setActiveTab("wishlist")}
          >
            Wishlist
          </button>
          <button
            className={`block w-full text-left py-2 px-4 rounded-md ${
              activeTab === "reading" ? "bg-blue-600" : "bg-gray-700"
            } hover:bg-blue-600`}
            onClick={() => setActiveTab("reading")}
          >
            Sedang Dibaca
          </button>
          <button
            className={`block w-full text-left py-2 px-4 rounded-md ${
              activeTab === "reviews" ? "bg-blue-600" : "bg-gray-700"
            } hover:bg-blue-600`}
            onClick={() => setActiveTab("reviews")}
          >
            Ulasan Saya
          </button>
          <button
            className={`block w-full text-left py-2 px-4 rounded-md ${
              activeTab === "profile" ? "bg-blue-600" : "bg-gray-700"
            } hover:bg-blue-600`}
            onClick={() => setActiveTab("profile")}
          >
            Profil Saya
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Render Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
