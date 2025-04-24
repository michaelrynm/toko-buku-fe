import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import axios from "axios";

const OrdersPage = () => {
  // Hardcoded data untuk pesanan
  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // UseEffect to simulate fetching data from an API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("orders response: ", response.data.orders);
        setOrders(response.data.orders);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
                  to="/orders"
                  className="text-gray-500 hover:text-blue-600"
                >
                  Pesanan Saya
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

          {/* Order History */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Riwayat Pesanan
            </h2>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex flex-col md:flex-row md:justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Order ID:{" "}
                            <span className="font-medium">
                              {order.id.substring(0, 8)}...
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Tanggal:{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "PROCESSING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status === "DELIVERED"
                              ? "Terkirim"
                              : order.status === "SHIPPED"
                              ? "Dikirim"
                              : order.status === "PROCESSING"
                              ? "Diproses"
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start py-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={
                                item.book.imageUrl || "/placeholder-book.png"
                              }
                              alt={item.book.title}
                              className="w-16 h-20 object-cover rounded-md"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium text-gray-800">
                              {item.book.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.book.author}
                            </p>
                            <div className="flex justify-between mt-2">
                              <p className="text-sm text-gray-600">
                                {item.quantity} × Rp{" "}
                                {item.price.toLocaleString("id-ID")}
                              </p>
                              <p className="font-medium">
                                Rp{" "}
                                {(item.quantity * item.price).toLocaleString(
                                  "id-ID"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="bg-gray-50 p-4 border-t border-gray-200">
                      <div className="flex flex-col md:flex-row md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <h4 className="font-medium text-gray-700 mb-1">
                            Informasi Pengiriman
                          </h4>
                          <p className="text-sm text-gray-600">{order.name}</p>
                          <p className="text-sm text-gray-600">{order.email}</p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Metode Pembayaran: {order.paymentMethod}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-sm text-gray-600">
                            Total Pesanan:
                          </p>
                          <p className="text-xl font-bold text-gray-800">
                            Rp {order.totalAmount.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600">Belum ada pesanan.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
