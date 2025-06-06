// components/ModalProvider.jsx
'use client'; // This needs to be a client component

import { useEffect, useState } from 'react';
import Modal from 'react-modal';

export default function ModalProvider({ children }) {
  // Use a state variable to track if the client side is mounted
  // This ensures setAppElement is called only after the first render
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Set the app element once the component is mounted on the client side
    if (typeof window !== 'undefined') {
       // Use a try/catch in case the element isn't immediately available,
       // although with useEffect this should be rare for #__next
       try {
          // Use the default Next.js root element ID
          Modal.setAppElement('#_next');
          setIsMounted(true); // Indicate that modal setup is complete
       } catch (e) {
           console.error("Failed to set react-modal app element:", e);
           // Handle the error, maybe retry or log
       }
    }
  }, []); // The empty dependency array ensures this runs only once on mount

  if (!isMounted) {
    // Optionally render a loading state or null until mounted
    // This might prevent hydration errors if Modal setup affects initial render
    return null; // Or a loading spinner
  }

  // Render the rest of your app
  return <>{children}</>;
}