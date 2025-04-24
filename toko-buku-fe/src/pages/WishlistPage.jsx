import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import axios from "axios";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Wishlist response:", response.data);
        if (response.data.success && response.data.wishlist) {
          setWishlistItems(response.data.wishlist.items || []);
        } else {
          setWishlistItems([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/wishlist/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state after successful removal
      setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      alert("Failed to remove item from wishlist. Please try again.");
    }
  };

  const addToCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/cart",
        { bookId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Item added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/booklist"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Kembali ke katalog buku
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="text-gray-500 hover:text-blue-600">
                  Beranda
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-gray-500 hover:text-blue-600"
                >
                  Wishlist
                </Link>
              </li>
            </ol>
          </nav>

          {/* Back button (mobile) */}
          <div className="md:hidden mb-4">
            <Link
              to="/booklist"
              className="inline-flex items-center text-blue-600"
            >
              <FaArrowLeft className="mr-2" /> Kembali ke Katalog
            </Link>
          </div>

          {/* Wishlist section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Wishlist Saya
            </h2>

            {wishlistItems.length > 0 ? (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm mb-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.book.imageUrl || "/placeholder-book.png"}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-book.png";
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {item.book.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          oleh {item.book.author}
                        </p>
                        <p className="text-blue-600 font-semibold mt-1">
                          Rp {item.book.price.toLocaleString("id-ID")}
                        </p>
                        {item.book.stock > 0 ? (
                          <p className="text-green-600 text-xs mt-1">
                            Tersedia
                          </p>
                        ) : (
                          <p className="text-red-600 text-xs mt-1">
                            Stok Habis
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4 sm:mt-0">
                      <button
                        onClick={() => addToCart(item.book.id)}
                        disabled={item.book.stock <= 0}
                        className={`flex items-center px-3 py-1 rounded-md text-sm cursor-pointer ${
                          item.book.stock > 0
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <FaShoppingCart className="mr-1" /> Tambah ke Keranjang
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-red-600 hover:text-red-800 p-2 cursor-pointer"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <p className="text-gray-600 mb-4">Wishlist Anda kosong.</p>
                <Link
                  to="/booklist"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Jelajahi Katalog Buku
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;
