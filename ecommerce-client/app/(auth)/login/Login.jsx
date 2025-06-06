"use client";
import React, { useContext } from 'react';
import { EyeIcon, EyeOffIcon, UserIcon, LockIcon, ArrowRightIcon } from "lucide-react";
import { useId, useState } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { userLogin } from '@/lib/api/login-register';
import Link from 'next/link';
import { UserContext } from '@/app/context/UserContext';

const Login = () => {
  // --- Router instance for navigation ---
  const router = useRouter();
  const {setUserLogedIn , userLogedIn} = useContext(UserContext);
console.log(userLogedIn);

  // --- React Hook Form setup ---
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    mode: "onBlur", // Validate on blur
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // --- Generate unique IDs for inputs ---
  const emailId = useId();
  const passwordId = useId();

  // --- State management ---
  const [isVisible, setIsVisible] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // --- Handlers ---
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const toggleRememberMe = () => setRememberMe((prev) => !prev);

  // --- Form submission handler ---
  const onSubmit = async (data) => {
    setLoginError('');
    
    try {
      const response = await userLogin(data);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      console.log("Login successful:", response.data);
      
      // Store token based on remember me preference
      if (rememberMe) {
        setUserLogedIn(true);
        localStorage.setItem('token', JSON.stringify(response.data));
      } else {  
        sessionStorage.setItem('token', JSON.stringify(response.data));
      }

      // Navigate based on role
      if (response.data.role === "admin") {
        router.push("/admin");
      } else if (response.data.role === "merchant") {
        router.push("/merchant");
      } else if (response.data.role === "customer") {
        router.push("/products");
      } else {
        throw new Error('Invalid user role');
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.response?.data?.message || 
        error.message ||
        'Unable to login. Please check your credentials and try again.'
      );
    }
  };

  const handleSignUpClick = () => {
    router.push('/signup/customer');
  };

  return (
    <div className="min-h-[90dvh] w-full  flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserIcon size={24} className="text-gray-800" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
        </div>
        
        {/* Error message */}
        {loginError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {loginError}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor={emailId} className="text-gray-700 font-medium">Email Address</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon size={16} className="text-gray-400" />
              </div>
              <Input
                id={emailId}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-gray-800 focus:ring-gray-800"
                placeholder="your.email@example.com"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address"
                  }
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={passwordId} className="text-gray-700 font-medium">Password</Label>
              <Link 
                href="/forgot-password" 
                className="text-xs text-gray-800 hover:text-gray-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon size={16} className="text-gray-400" />
              </div>
              <Input
                id={passwordId}
                className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:border-gray-800 focus:ring-gray-800"
                placeholder="Enter your password"
                type={isVisible ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
              >
                {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
              checked={rememberMe}
              onChange={toggleRememberMe}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRightIcon size={16} />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2 px-4 rounded-lg transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path 
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                fill="#4285F4" 
              />
              <path 
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                fill="#34A853" 
              />
              <path 
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                fill="#FBBC05" 
              />
              <path 
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                fill="#EA4335" 
              />
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white py-2 px-4 rounded-lg transition-colors"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
            <span>Continue with Facebook</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={handleSignUpClick}
              className="font-medium text-gray-800 hover:text-gray-600 hover:underline focus:outline-none"
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;