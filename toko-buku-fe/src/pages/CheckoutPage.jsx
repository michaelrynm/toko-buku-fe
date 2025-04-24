import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/navbar.jsx";
import Swal from "sweetalert2";

const CheckoutPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Mengambil quantity dari state yang dikirim oleh BookDetail
  const initialQuantity = location.state?.quantity || 1;

  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    shippingAddress: "", // mengubah dari address menjadi shippingAddress sesuai API
  });
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:3000/api/books/${id}`
        );

        if (response.data) {
          setBook({
            ...response.data.book,
          });
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Mendapatkan token dari localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          title: "Login Required",
          text: "You need to login first",
          icon: "warning",
          confirmButtonText: "OK",
        });
        navigate("/login");
        return;
      }

      // Membuat objek order
      const orderData = {
        name: userInfo.name,
        email: userInfo.email,
        shippingAddress: userInfo.shippingAddress,
        paymentMethod: paymentMethod,
        items: [
          {
            bookId: id,
            quantity: quantity,
            price: book.price,
          },
        ],
      };

      // Mengirim order ke API
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Pembelian Berhasil!",
          text: "Terima kasih atas pembelian Anda",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Redirect ke halaman order history atau home
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error placing order:", error);

      Swal.fire({
        title: "Gagal Melakukan Pembelian",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
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
                  to="/booklist"
                  className="text-gray-500 hover:text-blue-600"
                >
                  Katalog
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link
                  to={`/book/${id}`}
                  className="text-gray-500 hover:text-blue-600"
                >
                  {book.title}
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-blue-600 font-bold truncate max-w-xs">
                Checkout
              </li>
            </ol>
          </nav>

          {/* Back button (mobile) */}
          <div className="md:hidden mb-4">
            <Link
              to={`/book/${id}`}
              className="inline-flex items-center text-blue-600"
            >
              <FaArrowLeft className="mr-2" /> Kembali ke Detail Buku
            </Link>
          </div>

          {/* Checkout form */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Informasi Pembelian
            </h2>

            <form onSubmit={handleCheckout}>
              {/* User Information */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  placeholder="Masukkan nama Anda"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Pengiriman
                </label>
                <textarea
                  name="shippingAddress"
                  value={userInfo.shippingAddress}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  placeholder="Masukkan alamat lengkap pengiriman"
                  required
                ></textarea>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Metode Pembayaran
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="creditCard"
                      checked={paymentMethod === "creditCard"}
                      onChange={handlePaymentChange}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">
                      Kartu Kredit
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bankTransfer"
                      checked={paymentMethod === "bankTransfer"}
                      onChange={handlePaymentChange}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">
                      Transfer Bank
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Rincian Pesanan
                </h3>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Buku</span>
                  <span className="text-gray-600">{book.title}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Jumlah</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      type="button"
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
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Harga</span>
                  <span className="text-gray-600">{book.price}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {typeof book.price === "number"
                      ? `Rp${(book.price * quantity).toLocaleString("id-ID")}`
                      : book.price}{" "}
                    {/* Menampilkan harga dengan format yang tepat */}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 ${
                  isSubmitting
                    ? "bg-blue-400 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-md`}
              >
                {isSubmitting ? "Memproses..." : "Selesaikan Pembelian"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-8">
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

export default CheckoutPage;
