"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CircleCheckIcon, XIcon, AlertCircleIcon, InfoIcon } from "lucide-react"

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

// Create a context for the toast
const ToastContext = createContext({
  showToast: () => {},
})

// Progress timer hook (reused from your Notification component)
function useProgressTimer({
  duration,
  interval = 100,
  onComplete,
}) {
  const [progress, setProgress] = useState(duration)
  const timerRef = React.useRef(0)
  const timerState = React.useRef({
    startTime: 0,
    remaining: duration,
    isPaused: false,
  })

  const cleanup = useCallback(() => {
    window.clearInterval(timerRef.current)
  }, [])

  const reset = useCallback(() => {
    cleanup()
    setProgress(duration)
    timerState.current = {
      startTime: 0,
      remaining: duration,
      isPaused: false,
    }
  }, [duration, cleanup])

  const start = useCallback(() => {
    const state = timerState.current
    state.startTime = Date.now()
    state.isPaused = false

    timerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - state.startTime
      const remaining = Math.max(0, state.remaining - elapsedTime)

      setProgress(remaining)

      if (remaining <= 0) {
        cleanup()
        if (onComplete) {
          onComplete()
        }
      }
    }, interval)
  }, [interval, cleanup, onComplete])

  const pause = useCallback(() => {
    const state = timerState.current
    if (!state.isPaused) {
      cleanup()
      state.remaining = Math.max(
        0,
        state.remaining - (Date.now() - state.startTime)
      )
      state.isPaused = true
    }
  }, [cleanup])

  const resume = useCallback(() => {
    const state = timerState.current
    if (state.isPaused && state.remaining > 0) {
      start()
    }
  }, [start])

  React.useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    progress,
    start,
    pause,
    resume,
    reset,
  }
}

// Toast Provider Component
export function CustomToastProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [toastData, setToastData] = useState({
    title: '',
    description: '',
    type: 'success',
    action: null,
    actionText: '',
  })
  
  const toastDuration = 5000
  const { progress, start, pause, resume, reset } = useProgressTimer({
    duration: toastDuration,
    onComplete: () => setOpen(false),
  })

  const showToast = useCallback((options) => {
    const { title, description, type , action, actionText } = options
    
    setToastData({
      title: title || (type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Notification'),
      description,
      type,
      action,
      actionText,
    })
    
    setOpen(false) // Close any existing toast
    
    // Small delay to ensure the previous toast is removed from the DOM
    setTimeout(() => {
      setOpen(true)
      reset()
      start()
    }, 100)
  }, [reset, start])

  const handleOpenChange = useCallback((isOpen) => {
    setOpen(isOpen)
    if (isOpen) {
      reset()
      start()
    }
  }, [reset, start])

  // Determine icon and color based on type
  const getIconAndColor = () => {
    switch (toastData.type) {
      case 'success':
        return { 
          icon: <CircleCheckIcon className="mt-0.5 shrink-0 text-emerald-500" size={16} aria-hidden="true" />,
          progressColor: 'bg-emerald-500'
        }
      case 'error':
        return { 
          icon: <AlertCircleIcon className="mt-0.5 shrink-0 text-red-500" size={16} aria-hidden="true" />,
          progressColor: 'bg-red-500'
        }
      case 'info':
        return { 
          icon: <InfoIcon className="mt-0.5 shrink-0 text-blue-500" size={16} aria-hidden="true" />,
          progressColor: 'bg-blue-500'
        }
      default:
        return { 
          icon: <CircleCheckIcon className="mt-0.5 shrink-0 text-emerald-500" size={16} aria-hidden="true" />,
          progressColor: 'bg-emerald-500'
        }
    }
  }

  const { icon, progressColor } = getIconAndColor()

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastProvider swipeDirection="right">
        <Toast
          open={open}
          onOpenChange={handleOpenChange}
          onPause={pause}
          onResume={resume}
        >
          <div className="flex w-full justify-between gap-3">
            {icon}
            <div className="flex grow flex-col gap-3">
              <div className="space-y-1">
                <ToastTitle>{toastData.title}</ToastTitle>
                <ToastDescription>
                  {toastData.description}
                </ToastDescription>
              </div>
              {/* {toastData.action && (
                <div>
                  <ToastAction altText={toastData.actionText || "Action"} asChild>
                    <Button size="sm" onClick={toastData.action}>
                      {toastData.actionText || "Action"}
                    </Button>
                  </ToastAction>
                </div>
              )} */}
            </div>
            <ToastClose asChild>
              <Button
                variant="ghost"
                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                aria-label="Close notification"
              >
                <XIcon
                  size={16}
                  className="opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Button>
            </ToastClose>
          </div>
          <div className="contents" aria-hidden="true">
            <div
              className={`pointer-events-none absolute bottom-0 left-0 h-1 w-full ${progressColor}`}
              style={{
                width: `${(progress / toastDuration) * 100}%`,
                transition: "width 100ms linear",
              }}
            />
          </div>
        </Toast>
        <ToastViewport className="sm:right-auto sm:left-0" />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

// Hook to use the toast
export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
