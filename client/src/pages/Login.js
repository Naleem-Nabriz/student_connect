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
  GraduationCap,
  ArrowRight,
  Sparkles,
  Users,
  BarChart3,
  BookOpenCheck,
} from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validation';

const loginHighlights = [
  {
    icon: Users,
    title: 'Peer collaboration',
    description: 'Join study groups, connect with classmates, and keep teamwork organized.',
  },
  {
    icon: BarChart3,
    title: 'Progress visibility',
    description: 'Track academic performance with dashboards that feel clear and motivating.',
  },
  {
    icon: BookOpenCheck,
    title: 'Resources in one place',
    description: 'Manage learning materials, skill matching, and opportunities from one workspace.',
  },
];

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
    } catch (submitError) {
      toast.error(submitError.response?.data?.message || 'Login failed');
    }
  };

  const emailValue = watch('email');
  const passwordValue = watch('password');

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(15,108,122,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(224,122,95,0.16),transparent_24%),linear-gradient(180deg,#fdf6ec_0%,#fffaf2_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-white/70 bg-white/70 shadow-[0_35px_90px_rgba(61,61,61,0.14)] backdrop-blur-sm lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden bg-[linear-gradient(145deg,#0f6c7a,#0d8799_45%,#f2c94c_140%)] px-8 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(8,28,36,0.22),transparent_28%)]" />
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
                  Student workspace
                </div>
                <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
                  Sign in to a cleaner, smarter campus experience.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-white/82 sm:text-lg">
                  Manage academic progress, collaborate with peers, discover resources,
                  and keep everything moving from one polished dashboard.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {loginHighlights.map((item) => {
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
                    One account
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-3xl font-semibold">All student tools</p>
                      <p className="mt-2 text-sm leading-6 text-white/78">
                        Academic tracking, study groups, skill matching, resources, and more.
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
            <div className="mx-auto max-w-md">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f6c7a]">
                  Welcome back
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#2f2a25]">
                  Sign in to continue
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6f655c]">
                  Use your Uni-Connect account to access your dashboard and student tools.
                </p>
              </div>

              <div className="mt-8 rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)]">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {error && (
                    <div className="rounded-2xl border border-[#efb7aa] bg-[#fff1ed] px-4 py-3 text-sm text-[#b65740]">
                      {error}
                    </div>
                  )}

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
                        className={`form-input block w-full rounded-2xl border bg-[#fffaf4] py-3 pl-12 pr-4 text-[#2f2a25] placeholder-[#9a8f84] ${
                          errors.email
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                            : emailValue
                              ? 'border-green-400 focus:border-green-400 focus:ring-green-400'
                              : 'border-[#eadfce] focus:border-[#0f6c7a] focus:ring-[#0f6c7a]'
                        }`}
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
                        autoComplete="current-password"
                        minLength="6"
                        className={`form-input block w-full rounded-2xl border bg-[#fffaf4] py-3 pl-12 pr-12 text-[#2f2a25] placeholder-[#9a8f84] ${
                          errors.password
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                            : passwordValue
                              ? 'border-green-400 focus:border-green-400 focus:ring-green-400'
                              : 'border-[#eadfce] focus:border-[#0f6c7a] focus:ring-[#0f6c7a]'
                        }`}
                        placeholder="Enter your password"
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

                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="motion-button flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f6c7a,#0d8799)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,108,122,0.22)] transition-all duration-300 hover:shadow-[0_22px_45px_rgba(15,108,122,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="loading-spinner mr-2 h-4 w-4" />
                        Signing in...
                      </div>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between gap-4 border-t border-[#f0e5d7] pt-4 text-sm">
                    <p className="text-[#6f655c]">
                      Don&apos;t have an account?
                    </p>
                    <Link
                      to="/register"
                      className="motion-button font-semibold text-[#0f6c7a] transition-colors duration-300 hover:text-[#0c5965]"
                    >
                      Create account
                    </Link>
                  </div>
                </form>
              </div>

              <div className="mt-6 rounded-[24px] border border-[#eadfce] bg-[#fff8ef] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8e8174]">
                  Secure sign-in
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6f655c]">
                  Your session keeps your dashboard, resources, and collaboration tools connected in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
