import { Navigate, useRoutes } from "react-router-dom";
import LibraryApp from "./layouts/dashboard";
import AuthorPage from "./sections/@dashboard/author/AuthorPage";
import LoginPage from "./sections/auth/login/LoginPage";
import Page404 from "./pages/Page404";
import BorrowalPage from "./sections/@dashboard/borrowal/BorrowalPage";
import BookPage from "./sections/@dashboard/book/BookPage";
import DashboardAppPage from "./sections/@dashboard/app/DashboardAppPage";
import UsersPage from "./sections/@dashboard/user/UserPage";
import GenrePage from "./sections/@dashboard/genre/GenrePage";
import { useAuth } from "./hooks/useAuth";
import UserProfile from "./sections/@dashboard/user/UserProfile";
import BorrowalHistory from "./sections/@dashboard/borrowal/BorrowalHistory";
import BookDetails from "./sections/@dashboard/book/BookDetails";
import AuthorProfile from "./sections/@dashboard/author/AuthorProfile";
import ChangePassword from "./sections/auth/login/ChangePassword";

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useAuth();

  const commonRoutes = [
    { path: "books", element: <BookPage /> },
    { path: "authors", element: <AuthorPage /> },
    { path: "genres", element: <GenrePage /> },
    { path: "borrowals", element: <BorrowalPage /> },
    { path: "userprofile/:id", element: <UserProfile /> },
    { path: "userprofile/history/:id", element: <BorrowalHistory /> },
    { path: "books/:id", element: <BookDetails /> },
    { path: "author/:id", element: <AuthorProfile /> },
  ];

  const adminRoutes = useRoutes([
    {
      path: "/",
      element: <LibraryApp />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: "dashboard", element: <DashboardAppPage /> },
        ...commonRoutes,
        { path: "users", element: <UsersPage /> },
      ],
    },
    { path: "login", element: <LoginPage /> },
    { path: "change-password", element: <ChangePassword /> },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);

  const librarianRoutes = useRoutes([
    {
      path: "/",
      element: <LibraryApp />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: "dashboard", element: <DashboardAppPage /> },
        ...commonRoutes,
      ],
    },
    { path: "login", element: <LoginPage /> },
    { path: "change-password", element: <ChangePassword /> },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);

  const memberRoutes = useRoutes([
    {
      path: "/",
      element: <LibraryApp />,
      children: [
        { element: <Navigate to="/books" />, index: true },
        ...commonRoutes,
      ],
    },
    { path: "login", element: <LoginPage /> },
    { path: "change-password", element: <ChangePassword /> },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);

  const guestRoutes = useRoutes([
    { path: "login", element: <LoginPage /> },
    { path: "change-password", element: <ChangePassword /> },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/login" replace /> },
  ]);

  if (user) {
    if (user.isAdmin) {
      return adminRoutes;
    }
    if (user.isLibrarian) {
      return librarianRoutes;
    }
    return memberRoutes;
  }
  return guestRoutes;
}
