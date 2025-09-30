"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

function GlassIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.LineSegments>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004
      meshRef.current.rotation.x += 0.002
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= 0.002
      wireRef.current.rotation.x -= 0.001
    }
  })

  return (
    <>
      {/* Glassy solid */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshPhysicalMaterial
          color="#6ee7b7"
          roughness={0.1}
          metalness={0.6}
          transmission={0.85}
          thickness={1.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={1.5}
          reflectivity={0.8}
          transparent
        />
      </mesh>
      {/* Wireframe overlay */}
      <lineSegments ref={wireRef}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.6, 0)]} />
        <lineBasicMaterial color="#fff" linewidth={1} transparent opacity={0.25} />
      </lineSegments>
      {/* Glow effect */}
      <mesh ref={meshRef} scale={1.15}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial color="#6ee7b7" transparent opacity={0.08} />
      </mesh>
    </>
  )
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <GlassIcosahedron />
      </Canvas>
    </div>
  )
}