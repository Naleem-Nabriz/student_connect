import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
  BookOpenCheck,
} from 'lucide-react';
import { validateRequired, validateEmail, validatePassword } from '../utils/validation';

const registerHighlights = [
  {
    icon: ShieldCheck,
    title: 'Secure account setup',
    description: 'Create your student workspace with a clean and guided onboarding flow.',
  },
  {
    icon: Users,
    title: 'Find the right peers',
    description: 'Join collaborative study spaces and connect with skill-matched classmates.',
  },
  {
    icon: BookOpenCheck,
    title: 'Track everything',
    description: 'Manage learning resources, goals, reminders, and academic progress from day one.',
  },
];

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
  const firstNameValue = watch('firstName');
  const lastNameValue = watch('lastName');
  const usernameValue = watch('username');
  const emailValue = watch('email');
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (submitError) {
      toast.error(submitError.response?.data?.message || 'Registration failed');
    }
  };

  const getInputClassName = (hasError, hasValue) =>
    `form-input block w-full rounded-2xl border bg-[#fffaf4] py-3 pl-12 pr-4 text-[#2f2a25] placeholder-[#9a8f84] ${
      hasError
        ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
        : hasValue
          ? 'border-green-400 focus:border-green-400 focus:ring-green-400'
          : 'border-[#eadfce] focus:border-[#0f6c7a] focus:ring-[#0f6c7a]'
    }`;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(15,108,122,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(224,122,95,0.16),transparent_24%),linear-gradient(180deg,#fdf6ec_0%,#fffaf2_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-white/70 bg-white/70 shadow-[0_35px_90px_rgba(61,61,61,0.14)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden bg-[linear-gradient(145deg,#304b76,#0f6c7a_50%,#e07a5f_135%)] px-8 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(8,28,36,0.22),transparent_28%)]" />
            <div className="relative z-10 flex h-full flex-col">
              <Link
                to="/"
                className="motion-button inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/95 backdrop-blur-sm"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Uni-Connect
              </Link>

              <div className="mt-12 max-w-xl">
                <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/85">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  New account
                </div>
                <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
                  Create your space for smarter student growth.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-white/82 sm:text-lg">
                  Set up your Uni-Connect profile to organize academic progress,
                  collaborate with peers, and discover opportunities in one place.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {registerHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="motion-card rounded-[24px] border border-white/14 bg-white/10 p-4 backdrop-blur-sm"
                    >
                      <div className="mb-3 inline-flex rounded-2xl bg-white/14 p-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-sm font-semibold">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-white/78">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto pt-10">
                <div className="rounded-[28px] border border-white/14 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
                    Start here
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-3xl font-semibold">One profile, full access</p>
                      <p className="mt-2 text-sm leading-6 text-white/78">
                        Join the platform once and unlock collaboration, tracking, reminders, and resource discovery.
                      </p>
                    </div>
                    <div className="rounded-full bg-white/14 p-3">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(255,255,255,0.98))] px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <div className="mx-auto max-w-xl">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f6c7a]">
                  Join Uni-Connect
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#2f2a25]">
                  Create your account
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6f655c]">
                  Fill in your details to start using the platform and connect with your academic tools.
                </p>
              </div>

              <div className="mt-8 rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)]">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {error && (
                    <div className="rounded-2xl border border-[#efb7aa] bg-[#fff1ed] px-4 py-3 text-sm text-[#b65740]">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-[#433c35]">
                        First Name
                      </label>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <User className="h-5 w-5 text-[#8e8174]" />
                        </div>
                        <input
                          {...register('firstName', {
                            validate: (value) => {
                              const required = validateRequired(value);
                              if (required !== true) return required;
                              if (value.trim().length < 2) return 'First name must be at least 2 characters';
                              return true;
                            },
                          })}
                          type="text"
                          required
                          autoComplete="given-name"
                          minLength="2"
                          maxLength="50"
                          className={getInputClassName(errors.firstName, firstNameValue)}
                          placeholder="First name"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-500">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-[#433c35]">
                        Last Name
                      </label>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <User className="h-5 w-5 text-[#8e8174]" />
                        </div>
                        <input
                          {...register('lastName', {
                            validate: (value) => {
                              const required = validateRequired(value);
                              if (required !== true) return required;
                              if (value.trim().length < 2) return 'Last name must be at least 2 characters';
                              return true;
                            },
                          })}
                          type="text"
                          required
                          autoComplete="family-name"
                          minLength="2"
                          maxLength="50"
                          className={getInputClassName(errors.lastName, lastNameValue)}
                          placeholder="Last name"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="mt-2 text-sm text-red-500">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-[#433c35]">
                      Username
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <User className="h-5 w-5 text-[#8e8174]" />
                      </div>
                      <input
                        {...register('username', {
                          validate: (value) => {
                            const required = validateRequired(value);
                            if (required !== true) return required;
                            if (value.trim().length < 3) return 'Username must be at least 3 characters';
                            if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
                            return true;
                          },
                        })}
                        type="text"
                        required
                        autoComplete="username"
                        minLength="3"
                        maxLength="30"
                        pattern="[a-zA-Z0-9_]+"
                        className={getInputClassName(errors.username, usernameValue)}
                        placeholder="Choose a username"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-2 text-sm text-red-500">{errors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#433c35]">
                      Email Address
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail className="h-5 w-5 text-[#8e8174]" />
                      </div>
                      <input
                        {...register('email', {
                          validate: (value) => validateEmail(value),
                        })}
                        type="email"
                        required
                        autoComplete="email"
                        className={getInputClassName(errors.email, emailValue)}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#433c35]">
                      Password
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Lock className="h-5 w-5 text-[#8e8174]" />
                      </div>
                      <input
                        {...register('password', {
                          validate: (value) => validatePassword(value),
                        })}
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        minLength="6"
                        maxLength="128"
                        className={`form-input block w-full rounded-2xl border bg-[#fffaf4] py-3 pl-12 pr-12 text-[#2f2a25] placeholder-[#9a8f84] ${
                          errors.password
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                            : passwordValue
                              ? 'border-green-400 focus:border-green-400 focus:ring-green-400'
                              : 'border-[#eadfce] focus:border-[#0f6c7a] focus:ring-[#0f6c7a]'
                        }`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="motion-button absolute inset-y-0 right-0 flex items-center pr-4 text-[#8e8174]"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#433c35]">
                      Confirm Password
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Lock className="h-5 w-5 text-[#8e8174]" />
                      </div>
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) => value === password || 'Passwords do not match',
                        })}
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        className={`form-input block w-full rounded-2xl border bg-[#fffaf4] py-3 pl-12 pr-4 text-[#2f2a25] placeholder-[#9a8f84] ${
                          errors.confirmPassword
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                            : confirmPasswordValue
                              ? 'border-green-400 focus:border-green-400 focus:ring-green-400'
                              : 'border-[#eadfce] focus:border-[#0f6c7a] focus:ring-[#0f6c7a]'
                        }`}
                        placeholder="Confirm your password"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="motion-button flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#304b76,#0f6c7a)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(48,75,118,0.22)] transition-all duration-300 hover:shadow-[0_22px_45px_rgba(48,75,118,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="loading-spinner mr-2 h-4 w-4" />
                        Creating account...
                      </div>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between gap-4 border-t border-[#f0e5d7] pt-4 text-sm">
                    <p className="text-[#6f655c]">
                      Already have an account?
                    </p>
                    <Link
                      to="/login"
                      className="motion-button font-semibold text-[#0f6c7a] transition-colors duration-300 hover:text-[#0c5965]"
                    >
                      Sign in here
                    </Link>
                  </div>
                </form>
              </div>

              <div className="mt-6 rounded-[24px] border border-[#eadfce] bg-[#fff8ef] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8e8174]">
                  New member setup
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6f655c]">
                  Create your profile once and start using academic progress tools, collaboration spaces, and resources immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
