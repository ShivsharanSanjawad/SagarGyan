import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Button } from '../ui/Button';
import { CustomInput } from '../ui/CustomInput';
import { Card, CardContent } from '../ui/card';
import { Cloud } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    twoFactorCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'username' ? value.trim() : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowTwoFactor(true);
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.twoFactorCode) {
      setErrors({ twoFactorCode: '2FA code is required' });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(formData.username, formData.password, formData.twoFactorCode);
      if (!success) {
        setErrors({ general: 'Invalid credentials or 2FA code' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center mb-1.5">
            <div className="mt-1 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
            <img
              src="/sidebarlogo.png"
              alt="Wave logo"
              className="w-full h-full object-cover"
            />
          </div>
          </div>
          <h1 className="text-2xl font-bold text-blue-950">SagarGyaan</h1>
          <p className="text-gray-600 mt-2">Oceanographic Data Platform</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 pt-1">
          <CardContent className="p-6">
            {/* Card Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg 
                  className="h-5 w-5 text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h1 className="text-lg font-semibold text-gray-900">
                  {!showTwoFactor ? 'Sign In' : 'Two-Factor Authentication'}
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                {!showTwoFactor 
                  ? 'Enter your credentials to access the platform'
                  : 'Enter the 6-digit code from your authenticator app'
                }
              </p>
            </div>

            {/* Error Alert */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {!showTwoFactor ? (
              <form onSubmit={handleInitialSubmit} className="space-y-4">
                <CustomInput
                  label="Username"
                  type="text"
                  name="username"
                  className='h-10'
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username}
                  placeholder="Enter your username"/>
                <CustomInput
                  label="Password"
                  type="password"
                  name="password"
                  className='h-10'
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  placeholder="Enter your password"/>
                <Button type="submit" className="w-full bg-blue-900 text-white mt-2">
                  Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
                <CustomInput
                  label="Authentication Code"
                  type="password"
                  name="twoFactorCode"
                  value={formData.twoFactorCode}
                  onChange={handleInputChange}
                  error={errors.twoFactorCode}
                  placeholder="000000"
                  className="text-center"
                  maxLength={6}/>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTwoFactor(false)}
                    className="flex-1">
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1  bg-blue-900 text-white">
                    {isLoading ? 'Verifying...' : 'Sign In'}
                  </Button>
                </div>
              </form>
            )}

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-gray-700 space-y-1">
                <div><strong>Admin:</strong> <code className="bg-gray-200 px-1 rounded">admin</code> / <code className="bg-gray-200 px-1 rounded">password123</code></div>
                <div><strong>Inspector:</strong> <code className="bg-gray-200 px-1 rounded">injector1</code> / <code className="bg-gray-200 px-1 rounded">password123</code></div>
                <div><strong>Scientist:</strong> <code className="bg-gray-200 px-1 rounded">scientist1</code> / <code className="bg-gray-200 px-1 rounded">password123</code></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center text-gray-500 text-sm">
          <Cloud className="h-4 w-4 mr-2" />
         <span>Powered by scalable cloud infrastructure</span>
        </div>
      </div>
    </div>
  );
};