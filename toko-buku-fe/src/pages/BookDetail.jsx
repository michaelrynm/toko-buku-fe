import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import Navbar from "../components/navbar.jsx";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../redux/cartSlice.js";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [bookReview, setBookReview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const navigate = useNavigate();

  // Redux hooks
  const dispatch = useDispatch();
  const { addingToCart, addError } = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:3000/api/books/${id}`
        );
        const review = await axios.get(
          `http://localhost:3000/api/reviews/book/${id}`
        );
        setBookReview(review.data.reviews);

        if (response.data) {
          setBook({
            ...response.data.book,
            numericPrice: response.data.book.price,
            category: response.data.book.category,
            isAvailable: response.data.book.stock > 0 ? true : false,
          });

          // Fetch related books
          try {
            const relatedResponse = await axios.get(
              "http://localhost:3000/api/books/new-releases"
            );
            if (relatedResponse.data && relatedResponse.data.books) {
              setRelatedBooks(relatedResponse.data.books.slice(0, 4));
            }
          } catch (err) {
            console.error("Error fetching related books:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetail();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Updated to use Redux
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          title: "Login Required",
          text: "You need to login first",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      const resultAction = await dispatch(
        addItemToCart({ bookId: id, quantity })
      );

      if (addItemToCart.fulfilled.match(resultAction)) {
        Swal.fire({
          title: "Item Berhasil Ditambahkan!",
          icon: "success",
          confirmButtonText: "Cool",
        });
      } else {
        throw new Error(resultAction.payload || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Gagal menambahkan buku ke keranjang!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const addToWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "You need to login first",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/wishlist`,
        { bookId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Item Berhasil Ditambahkan ke Wishlist!",
          icon: "success",
          confirmButtonText: "Cool",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          title: "Terdapat Kesalahan",
          text: "Buku sudah ada di wishlist",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to add to wishlist",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handlePurchase = () => {
    navigate(`/checkout/${id}`, { state: { quantity } });
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

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-yellow-500 mx-auto mb-4"
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
          <h2 className="text-xl font-bold mb-4">Buku tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">
            Maaf, buku yang Anda cari tidak dapat ditemukan.
          </p>
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

  console.log("related Book", relatedBooks);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with navigation */}
      <Navbar />

      {/* Main content */}
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
                  to="/booklist"
                  className="text-gray-500 hover:text-blue-600"
                >
                  Katalog
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-blue-600 font-medium truncate max-w-xs">
                {book.title}
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

          {/* Book details section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left column - Book image */}
              <div className="md:w-1/3 p-6 flex justify-center">
                <div className="relative">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="object-contain h-64 md:h-80 rounded shadow-md"
                  />
                </div>
              </div>

              {/* Right column - Book info */}
              <div className="md:w-2/3 p-6">
                <div className="mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {book.title}
                  </h1>
                  <p className="text-gray-600">
                    oleh <span className="font-medium">{book.author}</span>
                  </p>
                </div>

                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {book.category.charAt(0).toUpperCase() +
                      book.category.slice(1)}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-gray-600 text-sm">
                    {bookReview.length} ulasan
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-3xl font-bold text-blue-600">
                    {book.price}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {book.isAvailable ? (
                      <span className="text-green-600">✓ Stok tersedia</span>
                    ) : (
                      <span className="text-red-600">× Stok habis</span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-12 text-center border-x border-gray-300 py-2"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!book.isAvailable || addingToCart}
                    className={`flex-grow sm:flex-grow-0 px-6 py-2 rounded-md font-medium ${
                      !book.isAvailable
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : addingToCart
                        ? "bg-blue-400 text-white cursor-wait"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {addingToCart ? "Menambahkan..." : "Tambahkan ke Keranjang"}
                  </button>

                  <button
                    onClick={addToWishlist}
                    disabled={!book.isAvailable}
                    className={`flex-grow sm:flex-grow-0 px-6 py-2 rounded-md font-medium ${
                      book.isAvailable
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Tambahkan ke Wishlist
                  </button>

                  <button
                    onClick={handlePurchase}
                    disabled={!book.isAvailable}
                    className={`bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md font-medium ${
                      !book.isAvailable && "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    Beli
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Detail Buku:</h3>
                  <div>
                    <p>{book.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs section */}
            <div className="border-t border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === "reviews"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Ulasan ({bookReview?.length || 0})
                </button>
              </div>

              <div className="p-6">
                {activeTab === "reviews" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Ulasan Pembaca</h2>
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                      >
                        Tulis Ulasan
                      </button>
                    </div>

                    {showReviewForm && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <form onSubmit={(e) => e.preventDefault()}>
                          <h3 className="font-medium mb-4">
                            Bagikan Pendapat Anda
                          </h3>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Rating
                            </label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className="text-yellow-400 text-xl mr-1"
                                >
                                  <FaStar />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Nama
                            </label>
                            <input
                              type="text"
                              id="name"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              placeholder="Masukkan nama Anda"
                              required
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="review"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Ulasan
                            </label>
                            <textarea
                              id="review"
                              rows="4"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              placeholder="Bagikan pendapat Anda tentang buku ini"
                              required
                            ></textarea>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setShowReviewForm(false)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Kirim Ulasan
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {bookReview && bookReview.length > 0 ? (
                      <div className="space-y-6">
                        {bookReview.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-gray-200 pb-6 last:border-0"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  {review.user.name}
                                </h4>
                                <div className="flex items-center mt-1">
                                  <div className="flex text-yellow-400 mr-2">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className={
                                          i < review.rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }
                                        size={14}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {formatDate(review.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="mt-2">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Belum ada ulasan untuk buku ini. Jadilah yang pertama
                        memberikan ulasan!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related books section */}
          {relatedBooks.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Buku Terkait</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedBooks.map((relatedBook) => (
                  <div
                    key={relatedBook.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link to={`/book/${relatedBook.id}`}>
                      <div className="h-48 overflow-hidden">
                        <img
                          src={relatedBook.imageUrl}
                          alt={relatedBook.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3
                          className="font-medium text-gray-800 mb-1 line-clamp-1"
                          title={relatedBook.title}
                        >
                          {relatedBook.title}
                        </h3>
                        <p
                          className="text-sm text-gray-500 mb-3 line-clamp-2"
                          title={relatedBook.subtitle}
                        >
                          {relatedBook.subtitle}
                        </p>
                        <span className="text-blue-600 font-medium">
                          {relatedBook.price}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    to="/booklist"
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

export default BookDetail;
