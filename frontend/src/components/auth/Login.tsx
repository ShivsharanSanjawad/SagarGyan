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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#fdf2df' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/sidebarlogo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">SagarGyaan</h1>
          <p className="text-slate-600 mt-1">AI-Driven Ocean Data Platform</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-md">
          <CardContent className="px-8 pt-4 pb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {!showTwoFactor ? 'Sign In' : 'Two-Factor Authentication'}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {!showTwoFactor
                  ? 'Enter your credentials to access the platform'
                  : 'Enter the 6-digit code from your authenticator app'}
              </p>
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            {!showTwoFactor ? (
              <form onSubmit={handleInitialSubmit} className="space-y-4">
                <CustomInput
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username}
                  placeholder="Enter your username"/>
                <CustomInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  placeholder="Enter your password"/>
                <Button
                  type="submit"
                  className="w-full mt-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:scale-105 transition">
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

                <div className="flex gap-3 mt-6">
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
                    className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
                    {isLoading ? 'Verifying...' : 'Sign In'}
                  </Button>
                </div>
              </form>
            )}

            {/* Demo credentials */}
            {/* <div
              className="mt-6 p-4 rounded-lg border"
              style={{ backgroundColor: '#fdf2df' }}
            >
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-slate-700 space-y-1">
                <div>
                  <strong>Admin:</strong>{' '}
                  <code className="bg-white px-1 rounded">admin</code> /{' '}
                  <code className="bg-white px-1 rounded">password123</code>
                </div>
                <div>
                  <strong>Inspector:</strong>{' '}
                  <code className="bg-white px-1 rounded">injector1</code> /{' '}
                  <code className="bg-white px-1 rounded">password123</code>
                </div>
                <div>
                  <strong>Scientist:</strong>{' '}
                  <code className="bg-white px-1 rounded">scientist1</code> /{' '}
                  <code className="bg-white px-1 rounded">password123</code>
                </div>
              </div> */}
            {/* </div> */}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center text-slate-600 text-sm">
          <Cloud className="h-4 w-4 mr-2 text-teal-600" />
          <span>Powered by scalable cloud infrastructure</span>
        </div>
      </div>
    </div>
  );
};
