// import { BrowserRouter as Router } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/authContext';
// import { LoginForm } from './components/auth/Login';
// import { Layout } from './components/layouts/Layout';
// import 'leaflet/dist/leaflet.css';

// function AppContent() {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
//       </div>
//     );
//   }

//   return isAuthenticated ? <Layout /> : <LoginForm />;
// }

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import { LoginForm } from './components/auth/Login';
import { Layout } from './components/layouts/Layout';
import { Landing } from './components/Landing'; 
import 'leaflet/dist/leaflet.css';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Login Route Component
function LoginRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />;
}

function AppContent() {
  return (
    <Routes>
      {/* Landing Page - Default route */}
      <Route path="/" element={<Landing />} />
      
      {/* Login Page */}
      <Route path="/login" element={<LoginRoute />} />
      
      {/* Protected Dashboard/App Routes */}
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect any unknown routes to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;