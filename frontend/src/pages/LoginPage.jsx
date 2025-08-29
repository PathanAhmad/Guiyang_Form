import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../hooks/useToast';
 

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    userid: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, clearError, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Clear error when component mounts or credentials change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [credentials.userid, credentials.password, clearError, error]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/queuedashboard';
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.userid.trim() || !credentials.password.trim()) {
      showToast('Please enter both username and password', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(credentials);
      
      if (result.success) {
        showToast('Login successful! Redirecting...', 'success');
        // Redirect to queue dashboard after successful login
        setTimeout(() => {
          window.location.href = '/queuedashboard';
        }, 1000);
      } else {
        showToast(result.error || 'Login failed', 'error');
      }
    } catch (error) {
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-6">
            <img
              src="/sparkOS.png"
              alt="Spark-OS"
              className="h-16 md:h-20 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Sign in to access the queue management system
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <Card.Body className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-red-600 text-sm font-medium">
                      ❌ {error}
                    </span>
                  </div>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  id="userid"
                  name="userid"
                  value={credentials.userid}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !credentials.userid.trim() || !credentials.password.trim()}
                className="w-full py-3 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <span className="mr-2">🔐</span>
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                Queue Management System • Admin Access Only
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* Back to Main Site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
