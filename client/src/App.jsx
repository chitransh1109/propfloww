import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoutes'
import Layout from './components/Layout'

// ── Lazy-loaded pages (each becomes its own chunk) ──
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/login'))
const PropertiesListing = lazy(() => import('./pages/PropertiesListing'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/settings'))

// ── Themed loading fallback ──
const PageLoader = () => (
  <div className="propflow-loader">
    <div className="propflow-loader__brand">Prop<span>Flow</span></div>
    <div className="propflow-loader__spinner" />
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/properties"
                element={
                  <Layout>
                    <PropertiesListing />
                  </Layout>
                }
              />
              <Route
                path="/properties/:id"
                element={
                  <Layout>
                    <PropertyDetail />
                  </Layout>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/owner"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/settings"
                element={
                  <Layout>
                    <Settings />
                  </Layout>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App