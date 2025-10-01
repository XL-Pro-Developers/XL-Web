"use client"

import { HeroMatrix } from "@/components/hero-matrix"
import SplashCursor from "@/components/SplashCursor"
import { useIsMobile } from "@/components/ui/use-mobile"
import BlobCursor from './BlobCursor';
export function BackgroundEffects() {
  const isMobile = useIsMobile()

  return (
    <>
      {/* Desktop: show both */}
      {!isMobile && (
        <>
          {/* <SplashCursor/> */}
          <BlobCursor/>
          <HeroMatrix
            className="fixed inset-0 -z-10 h-full w-full opacity-20 pointer-events-none"
          />
        </>
      )}

      {/* Mobile: show only HeroMatrix */}
      {isMobile && (
        <HeroMatrix
          className="fixed inset-0 -z-10 h-full w-full opacity-20 pointer-events-none"
        />
      )}
    </>
  )
}
