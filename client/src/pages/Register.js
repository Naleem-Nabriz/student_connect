import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { validateRequired, validateEmail, validatePassword } from '../utils/validation';

const Register = () => {
  const { register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: 'onChange' });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
            Join Uni-Connect
          </h2>
          <p className="mt-2 text-sm text-[#A0A3BD]">
            Create your account and start collaborating
          </p>
        </div>
        
        <div className="bg-[#1A1C22] border border-[#2A2D36] shadow-2xl rounded-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-white">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#A0A3BD]" />
                  </div>
                  <input
                    {...register('firstName', {
                      validate: value => {
                        const required = validateRequired(value);
                        if (required !== true) return required;
                        if (value.trim().length < 2) return 'First name must be at least 2 characters';
                        return true;
                      }
                    })}
                    type="text"
                    className={`block w-full pl-10 pr-3 py-2 bg-[#111217] border rounded-md text-white placeholder-[#A0A3BD] ${errors.firstName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : errors.firstName === undefined && watch('firstName') ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-[#2A2D36] focus:ring-[#FF7A00] focus:border-[#FF7A00]'}`}
                    placeholder="Enter first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-white">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('lastName', {
                      validate: value => {
                        const required = validateRequired(value);
                        if (required !== true) return required;
                        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
                        return true;
                      }
                    })}
                    type="text"
                    className={`form-input block w-full pl-10 pr-3 py-2 rounded-md ${errors.lastName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : watch('lastName') ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('username', {
                    validate: value => {
                      const required = validateRequired(value);
                      if (required !== true) return required;
                      if (value.trim().length < 3) return 'Username must be at least 3 characters';
                      if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
                      return true;
                    }
                  })}
                  type="text"
                  className={`form-input block w-full pl-10 pr-3 py-2 rounded-md ${errors.username ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : watch('username') ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                    placeholder="Choose a username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    validate: value => validateEmail(value),
                  })}
                  type="email"
                  className={`form-input block w-full pl-10 pr-3 py-2 rounded-md ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : watch('email') ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    validate: value => validatePassword(value),
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input block w-full pl-10 pr-10 py-2 rounded-md ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : watch('password') ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={!isValid || loading}
                className="btn-primary w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
