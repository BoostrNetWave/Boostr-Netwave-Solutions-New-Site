import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public site
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useAnimatedCounter } from './hooks/useAnimatedCounter';
import { useMagneticButton } from './hooks/useMagneticButton';
import { useHashScroll } from './hooks/useHashScroll';
import { useScrollToTop } from './hooks/useScrollToTop';

// Admin
import { AuthProvider } from './admin/context/AuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';

// Admin pages — lazy loaded (not shipped with public bundle)
const Dashboard       = lazy(() => import('./admin/pages/Dashboard'));
const AdminServices   = lazy(() => import('./admin/pages/AdminServices'));
const AdminProducts   = lazy(() => import('./admin/pages/AdminProducts'));
const AdminClientProjects = lazy(() => import('./admin/pages/AdminClientProjects'));
const AdminTeamMembers = lazy(() => import('./admin/pages/AdminTeamMembers'));
const AdminCareers    = lazy(() => import('./admin/pages/AdminCareers'));
const AdminTestimonials = lazy(() => import('./admin/pages/AdminTestimonials'));
const AdminGallery    = lazy(() => import('./admin/pages/AdminGallery'));
const AdminInbox      = lazy(() => import('./admin/pages/AdminInbox'));
const AdminSiteSettings = lazy(() => import('./admin/pages/AdminSiteSettings'));
const AdminBlog       = lazy(() => import('./admin/pages/AdminBlog'));
const AdminApplications = lazy(() => import('./admin/pages/AdminApplications'));

// Public pages
const Home           = lazy(() => import('./pages/public/Home'));
const Services       = lazy(() => import('./pages/public/Services'));
const ServiceDetail  = lazy(() => import('./pages/public/ServiceDetail'));
const Products       = lazy(() => import('./pages/public/Products'));
const ProductDetail  = lazy(() => import('./pages/public/ProductDetail'));
const CaseStudies    = lazy(() => import('./pages/public/CaseStudies'));
const CaseStudyDetail= lazy(() => import('./pages/public/CaseStudyDetail'));
const Careers        = lazy(() => import('./pages/public/Careers'));
const CareerDetail   = lazy(() => import('./pages/public/CareerDetail'));
const Team           = lazy(() => import('./pages/public/Team'));
const Blog           = lazy(() => import('./pages/public/Blog'));
const BlogDetail     = lazy(() => import('./pages/public/BlogDetail'));
const About          = lazy(() => import('./pages/public/About'));
const Contact        = lazy(() => import('./pages/public/Contact'));

// ─── Public Site Wrapper ──────────────────────────────────────────────────────
function PublicSite() {
  useScrollReveal();
  useAnimatedCounter();
  useMagneticButton();
  useHashScroll();
  useScrollToTop();

  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:slug" element={<CareerDetail />} />
            <Route path="/team" element={<Team />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
            success: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
          }}
        />
        <Suspense fallback={
          <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
          </div>
        }>
          <Routes>
            {/* ── Public ── */}
            <Route path="/*" element={<PublicSite />} />

            {/* ── Admin Auth ── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── Admin Protected ── */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard"      element={<Dashboard />} />
              <Route path="settings"       element={<AdminSiteSettings />} />
              <Route path="services"       element={<AdminServices />} />
              <Route path="products"       element={<AdminProducts />} />
              <Route path="client-projects" element={<AdminClientProjects />} />
              <Route path="team"           element={<AdminTeamMembers />} />
              <Route path="careers"        element={<AdminCareers />} />
              <Route path="testimonials"   element={<AdminTestimonials />} />
              <Route path="gallery"        element={<AdminGallery />} />
              <Route path="blog"           element={<AdminBlog />} />
              <Route path="inbox"          element={<AdminInbox />} />
              <Route path="applications"   element={<AdminApplications />} />
            </Route>

            {/* ── Catch-all ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}