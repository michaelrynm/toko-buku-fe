import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Landing from "../pages/Landing.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import RegisterPage from "../pages/Register.jsx";
import BookList from "../pages/BookList.jsx";
import BookDetail from "../pages/BookDetail.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import OrdersPage from "../pages/OrdersPage.jsx";
import WishlistPage from "../pages/WishlistPage.jsx";
export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/booklist",
      element: <BookList />,
    },
    {
      path: "/book/:id",
      element: <BookDetail />,
    },
    {
      path: "/checkout/:id",
      element: <CheckoutPage />,
    },
    {
      path: "/orders",
      element: <OrdersPage />,
    },
    {
      path: "/wishlist",
      element: <WishlistPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}
