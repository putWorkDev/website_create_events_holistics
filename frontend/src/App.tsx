import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ManageEventsPage from './pages/admin/ManageEventsPage';
import EventFormPage from './pages/admin/EventFormPage';
import ManageCategoriesPage from './pages/admin/ManageCategoriesPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="events" element={<ManageEventsPage />} />
            <Route path="events/new" element={<EventFormPage />} />
            <Route path="events/:id/edit" element={<EventFormPage />} />
            <Route path="categories" element={<ManageCategoriesPage />} />
            <Route path="users" element={<ManageUsersPage />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="mx-auto max-w-md px-4 py-24 text-center">
                <p className="font-serif text-5xl font-bold text-forest-700">404</p>
                <p className="mt-2 text-forest-900/70">This page wandered off the path.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
