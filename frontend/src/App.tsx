import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import { LoginForm } from './components/auth/Login';
import { Layout } from './components/layouts/Layout';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Layout /> : <LoginForm />;
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