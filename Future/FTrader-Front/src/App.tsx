import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Import pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

// Lazy load other pages to improve initial load time
const MarketData = lazy(() => import("./pages/MarketData"));
const OrderExecution = lazy(() => import("./pages/OrderExecution"));
const TradeHistory = lazy(() => import("./pages/TradeHistory"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const TokenGenerator = lazy(() => import("./pages/TokenGenerator"));
const StreamingTestPage = lazy(() => import("./pages/StreamingTestPage"));
const Analysis = lazy(() => import("./pages/Analysis"));
const Automation = lazy(() => import("./pages/Automation"));
const ModelDetailsPage = lazy(() => import("./pages/ModelDetailsPage"));

// Create a loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  // Mock authentication state - in a real app, this would come from an auth context
  const isAuthenticated = true;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              } />

              {/* Protected routes */}
              <Route path="/" element={
                isAuthenticated ? <Layout><Index /></Layout> : <Navigate to="/login" replace />
              } />
              <Route path="/dashboard" element={
                isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />
              } />
              <Route path="/market" element={
                isAuthenticated ? <Layout><MarketData /></Layout> : <Navigate to="/login" replace />
              } />
              <Route path="/orders" element={
                isAuthenticated ? <Layout><OrderExecution /></Layout> : <Navigate to="/login" replace />
              } />
              <Route path="/trades" element={
                isAuthenticated ? <Layout><TradeHistory /></Layout> : <Navigate to="/login" replace />
              } />
              <Route path="/portfolio" element={
                isAuthenticated ? <Layout><Portfolio /></Layout> : <Navigate to="/login" replace />
              } />
              <Route path="/settings" element={
                isAuthenticated ? <Layout><Settings /></Layout> : <Navigate to="/login" replace />
              } />
              <Route path="/analysis" element={
                isAuthenticated ? <Layout><Analysis /></Layout> : <Navigate to="/login" replace />
              } />
              <Route path="/analysis/machine-learning/:id" element={
                isAuthenticated ? <Layout><ModelDetailsPage /></Layout> : <Navigate to="/login" replace />
              } />
              <Route path="/automation" element={
                isAuthenticated ? <Layout><Automation /></Layout> : <Navigate to="/login" replace />
              } />
              
              {/* Testing routes */}
              <Route path="/streaming-test" element={
                isAuthenticated ? <Layout><StreamingTestPage /></Layout> : <Navigate to="/login" replace />
              } />
              
              {/* Token Generator */}
              <Route path="/token-generator" element={
                <Layout><TokenGenerator /></Layout>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
