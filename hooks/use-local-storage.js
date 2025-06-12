'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  // State to track if component has mounted (hydrated)
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Initialize with initialValue to match server-side render
  const [storedValue, setStoredValue] = useState(initialValue)

  // After hydration, load the actual value from localStorage
  useEffect(() => {
    setIsHydrated(true)
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.log(error)
    }
  }, [key])
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      // Save to local storage only after hydration
      if (isHydrated) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue, isHydrated]
}
