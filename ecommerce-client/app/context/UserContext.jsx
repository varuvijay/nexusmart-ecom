"use client"
import React, { createContext, useEffect, useState } from 'react'

export const UserContext = createContext()

export const UserWrapper = ({ children }) => {
  const [userLogedIn, setUserLogedIn] = useState(false)
  const [user, setUser] = useState(null)
  
  // Use a ref to track if the component is mounted
  const isMounted = React.useRef(false)
  
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true
    
    try {
      // Only run this code in the browser
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token')
        
        if (storedToken) {
          const token = JSON.parse(storedToken)
          console.log("Token loaded:", token)
          
          if (token != null && isMounted.current) {
            setUserLogedIn(true)
            setUser(token)
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
    
    // Cleanup function
    return () => {
      isMounted.current = false
    }
  }, [])

  // Prevent unnecessary re-renders by logging only when values change
  useEffect(() => {
    console.log("User state updated:", user)
    console.log("Login state:", userLogedIn)
  }, [user, userLogedIn])


  

  return (
    <UserContext.Provider value={{ 
      userLogedIn, 
      user, 
      setUserLogedIn,
      setUser 
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserWrapper")
  }
  return context
}