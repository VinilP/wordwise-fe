import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginForm, RegisterForm, ProtectedRoute } from '@/components/auth';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/components/layout/Dashboard';
import { HomePage, UserRecommendationsPage } from '@/components/pages';
import { TabbedRecommendationsPage } from '@/pages/recommendations/TabbedRecommendationsPage';
import { BooksPage, BookDetailPage } from '@/pages/books';
import { ProfilePage } from '@/pages/profile';
import { HowItWorksPage, PrivacyPage, TermsPage, CookiePage, AboutPage, ContactPage, HelpCenterPage, FAQPage, SupportPage } from '@/pages';
import ScrollToTop from '@/components/ScrollToTop';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
                      <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <TabbedRecommendationsPage />
            </ProtectedRoute>
          }
        />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiePage />} />
            </Route>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
