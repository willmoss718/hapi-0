'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

// Store for hash state to ensure consistent updates
const getHashSnapshot = () => {
  if (typeof window === 'undefined') return ''
  return window.location.hash.slice(1)
}

const getServerSnapshot = () => ''

const subscribe = (callback: () => void) => {
  // Listen to multiple events to catch all types of navigation
  window.addEventListener('hashchange', callback)
  window.addEventListener('popstate', callback)
  
  // Poll for hash changes as a fallback for Next.js router updates
  let lastHash = window.location.hash
  const checkInterval = setInterval(() => {
    if (window.location.hash !== lastHash) {
      lastHash = window.location.hash
      callback()
    }
  }, 100)
  
  return () => {
    window.removeEventListener('hashchange', callback)
    window.removeEventListener('popstate', callback)
    clearInterval(checkInterval)
  }
}

/**
 * Custom hook to manage URL hash state
 * @param options - Configuration options
 * @returns {object} - Object with hash value, setters, and utility functions
 */
export function useHash(options?: {
  scroll?: boolean
  replace?: boolean
}) {
  // Use useSyncExternalStore for reliable hash synchronization
  const hash = useSyncExternalStore(
    subscribe,
    getHashSnapshot,
    getServerSnapshot
  )

  // Handle scrolling when hash changes from external sources (e.g., Next.js router)
  useEffect(() => {
    if (options?.scroll !== false && hash) {
      console.log('[useHash] Hash changed to:', hash)
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(hash)
        console.log('[useHash] Scrolling to element:', element)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 50)
      
      return () => clearTimeout(timeoutId)
    }
  }, [hash, options?.scroll])

  const setHash = useCallback((newHash: string) => {
    if (typeof window === 'undefined') return

    const cleanHash = newHash.replace(/^#/, '')
    const hashWithPrefix = cleanHash ? `#${cleanHash}` : ''
    
    if (cleanHash === '') {
      // Remove hash from URL
      const method = options?.replace ? 'replaceState' : 'pushState'
      const newUrl = window.location.pathname + window.location.search
      window.history[method](null, '', newUrl)
    } else {
      // Set new hash
      if (options?.replace) {
        const newUrl = window.location.pathname + window.location.search + hashWithPrefix
        window.history.replaceState(null, '', newUrl)
      } else {
        // Using pushState to ensure the event fires
        const newUrl = window.location.pathname + window.location.search + hashWithPrefix
        window.history.pushState(null, '', newUrl)
      }
      
      // Manually trigger hashchange event for pushState/replaceState
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }

    // Handle scrolling behavior
    if (options?.scroll !== false && cleanHash) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const element = document.getElementById(cleanHash)
        element?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [options?.replace, options?.scroll])

  const clearHash = useCallback(() => {
    if (typeof window === 'undefined') return
    
    // Always use replaceState when clearing to avoid cluttering history
    const newUrl = window.location.pathname + window.location.search
    window.history.replaceState(null, '', newUrl)
    
    // Trigger update
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }, [])

  const isActive = useCallback((checkHash: string) => {
    const cleanCheckHash = checkHash.replace(/^#/, '')
    return hash === cleanCheckHash
  }, [hash])

  return {
    hash,
    setHash,
    clearHash,
    isActive,
  }
}

/**
 * Simple hook that returns [hash, setHash] tuple like useState
 * @returns {[string, (hash: string) => void]} - Current hash and setter
 */
export function useSimpleHash(): [string, (hash: string) => void] {
  const { hash, setHash } = useHash()
  return [hash, setHash]
}

export const smoothScrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};