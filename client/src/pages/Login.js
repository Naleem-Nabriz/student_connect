import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, GraduationCap } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validation';

const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0B0F] to-[#111217] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#FF7A00] to-[#FFB800] rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Sign in to Uni-Connect
          </h2>
          <p className="mt-2 text-sm text-[#A0A3BD]">
            Connect, collaborate, and succeed together
          </p>
        </div>
        
        <div className="bg-[#1A1C22] border border-[#2A2D36] shadow-2xl rounded-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#A0A3BD]" />
                </div>
                <input
                  {...register('email', {
                    validate: value => validateEmail(value)
                  })}
                  type="email"
                  className={`block w-full pl-10 pr-3 py-2 bg-[#111217] rounded-md text-white placeholder-[#A0A3BD] ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : watch('email') ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-[#2A2D36] focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]'}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#A0A3BD]" />
                </div>
                <input
                  {...register('password', {
                    validate: value => validatePassword(value)
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full pl-10 pr-10 py-2 bg-[#111217] rounded-md text-white placeholder-[#A0A3BD] ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : watch('password') ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-[#2A2D36] focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]'}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#A0A3BD]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#A0A3BD]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  );
};

export default Login;
