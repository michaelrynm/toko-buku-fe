import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import heroIllustration from "../assets/heroIllustration.png";
import Swal from "sweetalert2";

const LandingPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch data buku dari API publik
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/books/new-releases"
        );
        setBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Check if the user is logged in and set user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/auth/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data); // Set user data
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUser();
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Berhasil",
      confirmButtonText: "Ok",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        window.location.reload();
      }
    });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              Toko Buku
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex space-x-4">
              {user ? (
                <>
                  <Link
                    to="/booklist"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Katalog
                  </Link>
                  <Link
                    to="/wishlist"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/orders"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Pesanan Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white bg-green-500 px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="mt-4 md:hidden transition-all duration-300 ease-in-out">
              <div className="flex flex-col space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/booklist"
                      className="text-center text-blue-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Katalog
                    </Link>
                    <Link
                      to="/wishlist"
                      className="text-center text-blue-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <Link
                      to="/orders"
                      className="text-center text-blue-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pesanan Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-center text-white bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-center text-white bg-green-500 px-6 py-2 rounded-lg hover:bg-green-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col items-start max-w-lg mb-8 md:mb-0 md:pr-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-4 md:mb-6">
                  Toko Buku Online
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                  Temukan buku-buku terbaik untuk menemani hari-harimu dengan
                  koleksi kami yang lengkap!
                </p>
                <div className="flex space-x-4">
                  <Link
                    to="/booklist"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Lihat Katalog
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-100 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-200 transition duration-300"
                  >
                    Daftar
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-auto flex justify-center">
                {/* Placeholder image */}
                <img
                  src={heroIllustration}
                  alt="Ilustrasi membaca"
                  className="w-full max-w-sm md:w-80 lg:w-96 rounded-4xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
              Mengapa Memilih Kami?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                <div className="text-blue-500 text-4xl mb-4">📚</div>
                <h3 className="font-bold text-xl mb-2">Koleksi Lengkap</h3>
                <p className="text-gray-600">
                  Ribuan judul buku dari berbagai genre dan penulis terkenal.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                <div className="text-green-500 text-4xl mb-4">🚚</div>
                <h3 className="font-bold text-xl mb-2">Pengiriman Cepat</h3>
                <p className="text-gray-600">
                  Pesanan Anda akan sampai dengan cepat dan aman ke alamat
                  tujuan.
                </p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg shadow-sm">
                <div className="text-yellow-500 text-4xl mb-4">💰</div>
                <h3 className="font-bold text-xl mb-2">Harga Terbaik</h3>
                <p className="text-gray-600">
                  Dapatkan harga spesial dan diskon menarik untuk setiap
                  pembelian.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New Releases Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold">Baru Rilis</h2>
              <Link
                to="/booklist"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Lihat Semua &raquo;
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-semibold text-lg line-clamp-1"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p
                        className="text-gray-500 text-sm mt-1 line-clamp-2"
                        title={book.subtitle}
                      >
                        {book.subtitle}
                      </p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-blue-600 font-medium">
                          {book.price}
                        </span>
                        <Link
                          to={`/book/${book.id}`}
                          className="text-sm text-blue-500 hover:text-blue-700"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        <section className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Dapatkan Info Terbaru
              </h2>
              <p className="mb-6">
                Daftar newsletter kami untuk mendapatkan informasi tentang buku
                baru dan promo spesial!
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Alamat email Anda"
                  className="flex-grow px-4 py-2 rounded-lg text-gray-900 focus:outline-none border border-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 px-6 py-2 rounded-lg font-medium transition duration-300"
                >
                  Langganan
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6">
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

export default LandingPage;
