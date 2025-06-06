"use client";

import React from 'react';
import { ArrowRightIcon, ShoppingBagIcon, StoreIcon, ShieldCheckIcon, TruckIcon, CreditCardIcon, StarIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

const LearnMore = () => {
  const features = [
    {
      icon: <ShoppingBagIcon className="w-6 h-6" />,
      title: "Easy Shopping",
      description: "Browse through thousands of products with our intuitive interface and smart search functionality."
    },
    {
      icon: <StoreIcon className="w-6 h-6" />,
      title: "Merchant Platform",
      description: "Start your own store and reach customers worldwide with our powerful merchant tools."
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "Secure Transactions",
      description: "Shop with confidence using our secure payment system and buyer protection policies."
    },
    {
      icon: <TruckIcon className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping options with real-time tracking for all your orders."
    },
    {
      icon: <CreditCardIcon className="w-6 h-6" />,
      title: "Multiple Payment Options",
      description: "Choose from various payment methods including credit cards, digital wallets, and more."
    },
    {
      icon: <StarIcon className="w-6 h-6" />,
      title: "Customer Reviews",
      description: "Make informed decisions with authentic customer reviews and ratings."
    }
  ];

  const benefits = [
    {
      title: "For Customers",
      items: [
        "Wide selection of products across multiple categories",
        "Competitive prices and regular deals",
        "Secure shopping experience",
        "Easy returns and refunds",
        "24/7 customer support"
      ]
    },
    {
      title: "For Merchants",
      items: [
        "Easy store setup and management",
        "Powerful analytics and insights",
        "Marketing tools and promotions",
        "Secure payment processing",
        "Inventory management system"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Our E-commerce Platform
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Experience a new way of shopping and selling online with our comprehensive e-commerce solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/signup/customer" 
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Start Shopping
              </Link>
              <Link 
                href="/signup/merchant" 
                className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="text-gray-900 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <ul className="space-y-3">
                  {benefit.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <ArrowRightIcon className="w-5 h-5 text-gray-900 mr-2 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                <p className="text-gray-600">Sign up as a customer or merchant to get started</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBagIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse & Shop</h3>
                <p className="text-gray-600">Explore products or set up your store</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCardIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Checkout</h3>
                <p className="text-gray-600">Complete your purchase with secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our growing community of shoppers and sellers. Experience the future of e-commerce today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/signup/customer" 
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link 
              href="/login" 
              className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore; 