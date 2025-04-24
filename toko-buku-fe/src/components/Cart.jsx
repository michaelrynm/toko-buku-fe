import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "../redux/cartSlice.js";
import { Link } from "react-router-dom";

const CartDropdown = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const {
    items: cartItems,
    loading,
    error,
  } = useSelector((state) => state.cart);

  // Fetch cart data when component mounts
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  // Toggle cart dropdown
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const totalItems = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <div className="relative">
      {/* Cart Icon */}
      <button
        onClick={toggleCart}
        className="text-gray-600 hover:text-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isCartOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border border-gray-100 z-10">
          <div className="py-2 px-4">
            <h3 className="text-gray-800 font-semibold">Keranjang</h3>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            // Cart Items
            <div className="py-2 px-4 text-gray-600">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Keranjang kosong
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 py-2 border-b"
                  >
                    <img
                      src={item.book.imageUrl}
                      alt={item.book.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.book.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.book.author}
                      </p>
                      <div>
                        <p>Quantity: x {item.quantity}</p>
                        <p className="text-sm text-blue-600">{`$${item.subtotal.toFixed(
                          2
                        )}`}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          
          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <Link
                to="#"
                className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Beli
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
