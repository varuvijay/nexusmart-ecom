"use client";
import React, { useContext } from 'react';
import SearchBar from './SearchBar';
import UserIcon from './UserIcon';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logoo from '@/public/logo.png'
import { UserContext } from '@/app/context/UserContext';
import { ShoppingCart } from 'lucide-react';

const Navbar = () => {
    const pathname = usePathname();
    const routes = useRouter();
    const { userLogedIn, user } = useContext(UserContext);
    
    // Add safe checks for user object
    const userRole = user?.role || null;

    return (
        <>
            <div className='mx-2 sm:mx-20 mt-3 h-[10vh] w-[90%] border border-t-gray-200 border-b-gray-200 shadow-lg contain-content  '>
                <div className='mx-5 flex h-full max-w-full items-center justify-between'>
                    <Link href="/">
                        <div>
                            <Image 
                                src={logoo} 
                                alt="Logo" 
                                width={500}
                                height={500} 
                                className='h-15 object-contain w-30'
                            />
                        </div>
                    </Link>
                    <div className='flex'>
                        {/* Search bar - hidden on mobile, visible on desktop */}
                        <div className='hidden sm:flex'>
                            <SearchBar />
                        </div>
                        
                        {/* Cart or Merchant link - conditionally rendered based on user role */}
                        {userLogedIn && userRole && (
                            <div className={`hidden sm:flex ${pathname === "/signup/merchant" ? "sm:hidden" : ""}`}>
                                {userRole === "merchant" && pathname !== "/merchant" && (
                                    <Link href="/merchant">
                                        <button className='px-3 py-2 mx-3 cursor-pointer'>
                                            Merchant Page
                                        </button>
                                    </Link>
                                ) }
                                {userRole === "customer"  && pathname !== "/cart" &&  (
                                    <Link href="/products/cart" >
                                        <button className='px-3 py-2 mx-3 cursor-pointer' >
                                            <ShoppingCart />
                                        </button>
                                    </Link>
                                )}
                                {userRole === "admin"  && pathname !== "/admin" &&  (
                                    <Link href="/admin">
                                        <button className='px-3 py-2 mx-3 cursor-pointer'>
                                            Admin
                                        </button>
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* User authentication section */}
                        {userLogedIn ? (
                            <UserIcon />
                        ) : pathname === '/signup/customer' ? (
                            <Link href="/signup/merchant">
                                <button className='px-3 py-2 mx-3 border-2 rounded-sm text-sm cursor-pointer'>
                                    Become A Seller
                                </button>
                            </Link>
                        ) : (
                            pathname === '/login' ?( <Link href="/signup/customer">
                                <button className='px-3 py-2 mx-3 border-2 rounded-sm text-sm cursor-pointer'>
                                    Register
                                </button>
                            </Link>):
                            <Link href="/login">
                                <button className='px-3 py-2 mx-3 border-2 rounded-sm text-sm cursor-pointer'>
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;