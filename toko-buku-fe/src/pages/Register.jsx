import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import readingIllustration from "../assets/readingIllustration.jpg";
import Swal from "sweetalert2";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak sama";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      // Ganti dengan endpoint API Anda
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status == 201) {
        Swal.fire({
          title: "Register Berhasil!",
          text: "Silahkan Login!",
          icon: "success",
        });
      }
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general:
          error.response?.data?.message || "Terjadi kesalahan saat mendaftar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold text-blue-600"
            >
              Toko Buku
            </Link>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sudah punya akun? Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Form Section */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Daftar Akun
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Bergabunglah dengan kami dan nikmati akses ke ribuan buku
                  </p>
                </div>

                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                      placeholder="Masukkan nama lengkap Anda"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                      placeholder="Minimal 8 karakter"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                      placeholder="Masukkan password yang sama"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Memproses...
                        </>
                      ) : (
                        "Daftar Sekarang"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Sudah punya akun?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Login di sini
                    </Link>
                  </p>
                </div>
              </div>

              {/* Illustration Section */}
              <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-blue-400 to-indigo-600">
                <div className="flex items-center justify-center h-full p-6">
                  <div className="text-center">
                    <img
                      src={readingIllustration}
                      alt="Ilustrasi membaca"
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="mt-6 text-white">
                      <h3 className="text-xl font-bold mb-2">
                        Bergabung dengan Toko Buku
                      </h3>
                      <p className="text-blue-100">
                        Temukan ribuan koleksi buku berkualitas dari penulis
                        terkenal
                      </p>
                      <div className="mt-4 flex justify-center space-x-3">
                        <span className="bg-white bg-opacity-20 py-1 px-3 rounded-full text-sm text-black">
                          Diskon Member
                        </span>
                        <span className="bg-white bg-opacity-20 py-1 px-3 rounded-full text-sm text-black">
                          Pre-Order
                        </span>
                        <span className="bg-white bg-opacity-20 py-1 px-3 rounded-full text-sm text-black">
                          Gratis Ongkir
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Toko Buku. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link to="/terms" className="hover:text-gray-700">
                Syarat & Ketentuan
              </Link>
              <Link to="/privacy" className="hover:text-gray-700">
                Kebijakan Privasi
              </Link>
              <Link to="/help" className="hover:text-gray-700">
                Bantuan
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
