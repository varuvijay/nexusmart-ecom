"use client"
import {
  BoltIcon,
  BookOpenIcon,
  CarrotIcon,
  ChevronDownIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  ShoppingCart,
  UserPenIcon,
  Loader2,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "@/app/context/UserContext"
import { useToast } from "@/app/context/ToastContext"
import { userLogout } from "@/lib/api/login-register"
import { usePathname, useRouter } from "next/navigation"


export default function UserIcon() {
  const pathname = usePathname();
  const router = useRouter();
  const {user} = useContext(UserContext);
  const {showToast} = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    const checkUser = () => {
      if (user == null) {
        setIsLoading(true);
        setTimeout(checkUser, 500);
      } else {
        setIsLoading(false);
      }
    };

    checkUser();

    return () => {
      setIsLoading(false);
    };
  }, [user]);

  if (isLoading) {
    return (
      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
        <Avatar>
          <AvatarImage src="" alt="Profile image" />
          <AvatarFallback>
            <Loader2 className="h-4 w-4 animate-spin" />
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!user || !user.email) {
    return (
      <Link href="/login">
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src="" alt="Profile image" />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        </Button>
      </Link>
    );
  }

  const logoutHandler = async () => {
    try{
      localStorage.removeItem('token');
      const response = await userLogout(user.session);
      console.log(response.data);
      showToast({
        title: 'Logout Successful',
        description: 'You have been logged out.',
        type: 'success',
      });
      setIsLoading(true); // Force refresh
      // Force a hard refresh to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      if(error.response.data.message === 'Session is invalidated'){
      
        localStorage.removeItem('token');
        showToast({
          title: 'Session Expired',
          description: 'You have been logged out.',
          type: 'success',
        });
      }
      else
      showToast({
        title: 'Logout Failed',
        description: 'An error occurred while logging out.',
        type: 'error',
      });
    }
  }
   
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src="" alt="Profile image" />
            <AvatarFallback>{(user.email[0].toUpperCase())}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium ">
            {user.name} 
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
        {/* <Link href="/" ><DropdownMenuItem className="hover:motion-preset-focus cursor-pointer">
            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            User Profile
          </DropdownMenuItem></Link> */}
         {user.role === 'user' && 
          <Link href="/cart" ><DropdownMenuItem className="  sm:hidden cursor-pointer hover:motion-preset-focus " >
            <ShoppingCart  size={16} className="opacity-60 " aria-hidden="true" />
            <span>Cart</span>
          </DropdownMenuItem></Link>}

         {user.role === 'merchant' && 
          <Link href="/merchant" ><DropdownMenuItem className="  sm:hidden cursor-pointer hover:motion-preset-focus " >
            <ShoppingCart  size={16} className="opacity-60 " aria-hidden="true" />
            <span>Merchant dashboard</span>
          </DropdownMenuItem></Link>}
         {user.role === 'admin' && 
          <Link href="/admin" ><DropdownMenuItem className="  sm:hidden cursor-pointer hover:motion-preset-focus " >
            <ShoppingCart  size={16} className="opacity-60 " aria-hidden="true" />
            <span>Admin dashboard</span>
          </DropdownMenuItem></Link>}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:motion-preset-focus " onClick={logoutHandler}>
          <LogOutIcon size={16} className="opacity-60 " aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
