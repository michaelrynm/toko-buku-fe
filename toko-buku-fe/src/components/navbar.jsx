import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CartDropdown from "./Cart.jsx";
import avatar from "../assets/avatar.png";
export default function Navbar() {
  const [user, setUser] = useState(null); // State untuk data user
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State untuk membuka/tutup dropdown
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State error

  // Fetch user data saat component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Ambil token dari localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token tidak ditemukan");
        }

        // Kirim request ke API dengan header Authorization
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Menambahkan token ke header
          },
        });

        console.log("fetch me response", response);

        // Set data pengguna ke state
        setUser(response.data);
      } catch (error) {
        // Tangani error jika ada
        setError(
          error.message || "Terjadi kesalahan saat memuat data pengguna"
        );
      } finally {
        setLoading(false); // Set loading selesai
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    // Hapus token dari localStorage dan reset state user
    localStorage.removeItem("token");
    setUser(null); // Reset user state
    window.location.href = "/login"; // Redirect ke halaman login
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to={"/"}>
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              Toko Buku
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Cart Icon and Dropdown */}
            <CartDropdown />

            {/* Jika user sudah login, tampilkan avatar */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-7 h-7 rounded-full"
                  />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 z-10">
                    <div className="py-2 px-4">
                      <h3 className="text-gray-800 font-semibold">
                        {user.user.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{user.user.email}</p>
                    </div>
                    <Link to={"/orders"}>
                      <div className="py-2 px-4 text-gray-600 hover:bg-gray-100 cursor-pointer">
                        <p>Pesanan Saya</p>
                      </div>
                    </Link>
                    <Link to={"/wishlist"}>
                      <div className="py-2 px-4 text-gray-600 hover:bg-gray-100 cursor-pointer">
                        <p>Wishlist</p>
                      </div>
                    </Link>
                    <div
                      className="py-2 px-4 text-gray-600 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Tombol Login jika belum login
              <Link
                to="/login"
                className="hidden md:block text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
