import { useState, useEffect } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useDevice(): DeviceType {
  const [device, setDevice] = useState<DeviceType>('desktop')

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDevice('mobile')
      } else if (window.innerWidth < 1024) {
        setDevice('tablet')
      } else {
        setDevice('desktop')
      }
    }

    // Set initial configuration
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return device
}
