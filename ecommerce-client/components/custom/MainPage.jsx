"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { Review } from './Review';
import Link from 'next/link';

const MainPage = () => {
    const router = useRouter();
    return (
      <section>
        <div className=" mx-auto px-6 pt-20 pb-32 max-w-dvw">
          {/* Hero Text */}
          <div className="text-center mb-32 animate-fade-in-up animate-delay-200">
            <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-none  contain-content">
              NEXUSMART
            </h1>
            <h2 className="text-5xl md:text-7xl font-light mb-12 tracking-wide text-gray-600">
              SHOPPING
            </h2>
            <div className="w-32 h-px bg-black mx-auto mb-16 animate-scale-x animate-delay-500"></div>
            <p className="text-xl font-light max-w-2xl mx-auto leading-relaxed mb-16">
              Curated collection of premium products designed for the modern
              lifestyle. Quality meets simplicity in every piece.
            </p>
  
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-delay-700">
              <button className="bg-black text-white px-16 py-5 text-sm font-medium tracking-wide hover:bg-gray-800 transition-all duration-300 animate-slide-up" onClick={() => router.push('/products')}>
                EXPLORE COLLECTION
              </button>
              <Link 
                href="/learn-more" 
                className="border-2 border-black text-black px-16 py-5 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition-all duration-300 animate-slide-up animate-delay-100 inline-block"
              >
                LEARN MORE
              </Link>
            </div>
          </div>
  
          {/* Enhanced Product Showcase */}
          <div className="mb-32">
            <div className="text-center mb-16 animate-fade-in-up animate-delay-800">
              <h2 className="text-5xl font-light tracking-wider mb-4">
                COLLECTIONS
              </h2>
              <div className="w-24 h-px bg-black mx-auto"></div>
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up animate-delay-1000">
              {/* Large Featured Card */}
              <div className="lg:col-span-6 group cursor-pointer">
                <div className="relative w-full h-96 bg-black overflow-hidden animate-scale-105-hover">
                  <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black group-hover:from-gray-900 group-hover:to-black transition-all duration-700"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center animate-fade-in-up">
                      <div className="w-24 h-24 border border-white mx-auto mb-6 animate-spin-slow group-hover:animate-pulse"></div>
                      <h3 className="text-white text-3xl font-light tracking-widest mb-2">
                        PREMIUM
                      </h3>
                      <p className="text-gray-300 text-sm tracking-wide">
                        LUXURY COLLECTION
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-2xl font-light">From $299</p>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 border border-white rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
                  </div>
                </div>
              </div>
  
              {/* Two Smaller Cards */}
              <div className="lg:col-span-6 space-y-8">
                <div className="group cursor-pointer animate-delay-200">
                  <div className="relative w-full h-44 bg-gray-50 overflow-hidden animate-scale-105-hover">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-500"></div>
                    <div className="absolute inset-0 flex items-center">
                      <div className="flex items-center justify-between w-full px-8">
                        <div>
                          <h3 className="text-2xl font-light tracking-wide mb-1">
                            ESSENTIALS
                          </h3>
                          <p className="text-gray-600 text-sm">EVERYDAY BASICS</p>
                          <p className="text-xl font-light mt-2">From $99</p>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-4 h-16 bg-black group-hover:h-20 transition-all duration-300"></div>
                          <div className="w-4 h-12 bg-gray-400 group-hover:h-16 transition-all duration-300 delay-75"></div>
                          <div className="w-4 h-8 bg-gray-300 group-hover:h-12 transition-all duration-300 delay-150"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="group cursor-pointer animate-delay-400">
                  <div className="relative w-full h-44 bg-gray-900 overflow-hidden animate-scale-105-hover">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black group-hover:from-black group-hover:to-gray-800 transition-all duration-500"></div>
                    <div className="absolute inset-0 flex items-center">
                      <div className="flex items-center justify-between w-full px-8">
                        <div>
                          <h3 className="text-white text-2xl font-light tracking-wide mb-1">
                            LIMITED
                          </h3>
                          <p className="text-gray-300 text-sm">
                            EXCLUSIVE EDITION
                          </p>
                          <p className="text-white text-xl font-light mt-2">
                            From $499
                          </p>
                        </div>
                        <div className="relative">
                          <div className="w-16 h-16 border-2 border-white rounded-full animate-pulse-slow"></div>
                          <div className="absolute inset-0 w-16 h-16 border-t-2 border-white rounded-full animate-spin-slow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Product Categories Strip */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 animate-fade-in animate-delay-1200">
              <button className="px-8 py-3 text-sm font-medium tracking-widest border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 animate-slide-up">
                ELECTRONICS
              </button>
              <button className="px-8 py-3 text-sm font-medium tracking-widest border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 animate-slide-up animate-delay-100">
                FASHION
              </button>
              <button className="px-8 py-3 text-sm font-medium tracking-widest border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 animate-slide-up animate-delay-200">
                HOME & LIVING
              </button>
              <button className="px-8 py-3 text-sm font-medium tracking-widest border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 animate-slide-up animate-delay-300">
                ACCESSORIES
              </button>
            </div>
          </div>
  
          {/* Stats Section */}
          <div className="border-t border-b border-gray-200 py-16 mb-32 animate-fade-in animate-delay-1200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-counter">
                <div className="text-5xl font-black mb-2">50K</div>
                <p className="text-sm font-medium tracking-wide text-gray-600">
                  CUSTOMERS
                </p>
              </div>
              <div className="animate-counter animate-delay-200">
                <div className="text-5xl font-black mb-2">12K</div>
                <p className="text-sm font-medium tracking-wide text-gray-600">
                  PRODUCTS
                </p>
              </div>
              <div className="animate-counter animate-delay-400">
                <div className="text-5xl font-black mb-2">99%</div>
                <p className="text-sm font-medium tracking-wide text-gray-600">
                  SATISFACTION
                </p>
              </div>
              <div className="animate-counter animate-delay-600">
                <div className="text-5xl font-black mb-2">24/7</div>
                <p className="text-sm font-medium tracking-wide text-gray-600">
                  SUPPORT
                </p>
              </div>
            </div>
          </div>
  
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
            <div className="animate-slide-in-left">
              <div className="w-16 h-16 bg-black mb-8 animate-rotate-90"></div>
              <h3 className="text-3xl font-light mb-6 tracking-wide">
                PREMIUM QUALITY
              </h3>
              <p className="text-gray-600 font-light leading-relaxed text-lg">
                Every product is carefully selected and tested to meet our high
                standards. We believe in quality over quantity, ensuring each item
                in our collection represents excellence in design and
                craftsmanship.
              </p>
            </div>
  
            <div className="animate-slide-in-right animate-delay-300">
              <div className="w-16 h-16 border-2 border-black mb-8 animate-pulse-slow"></div>
              <h3 className="text-3xl font-light mb-6 tracking-wide">
                FAST DELIVERY
              </h3>
              <p className="text-gray-600 font-light leading-relaxed text-lg">
                Experience lightning-fast shipping with our streamlined logistics
                network. Most orders ship within 24 hours and arrive within 2-3
                business days, bringing your chosen products to your doorstep
                quickly and safely.
              </p>
            </div>
          </div>
  
          {/* Review Grid */}
          <Review />
  
          {/* Newsletter Section */}
          <div className="text-center bg-black text-white py-24 px-8 animate-fade-in animate-delay-1500">
            <h3 className="text-4xl font-light mb-6 tracking-wide">
              STAY UPDATED
            </h3>
            <p className="text-gray-300 font-light mb-12 max-w-xl mx-auto">
              Be the first to know about new arrivals, exclusive deals, and design
              insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                className="flex-1 bg-transparent border border-gray-600 px-6 py-4 text-white placeholder-gray-400 font-light tracking-wide focus:outline-none focus:border-white transition-colors duration-300"
              />
              <button className="bg-white text-black px-12 py-4 font-medium tracking-wide hover:bg-gray-200 transition-colors duration-300 animate-slide-up">
                SUBSCRIBE
              </button>
            </div>
          </div>
  
         
        </div>
      </section>
    );
}

export default MainPage