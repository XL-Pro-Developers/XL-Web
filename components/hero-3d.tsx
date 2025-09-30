"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"

function InteractiveIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.LineSegments>(null)
  const { size, gl } = useThree()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [spinSpeed, setSpinSpeed] = useState(0)
  const spinDecay = 0.96 // Lower = stops faster, Higher = spins longer

  // Animate rotation and respond to mouse
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 + spinSpeed
      meshRef.current.rotation.x += 0.005 + spinSpeed * 0.5
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= 0.005 + spinSpeed * 0.5
      wireRef.current.rotation.x -= 0.002 + spinSpeed * 0.25
    }
    // Decay spin speed
    setSpinSpeed((s) => Math.abs(s) < 0.0001 ? 0 : s * spinDecay)
  })

  // Mouse move handler
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      setMouse({
        x: (e.clientX / size.width - 0.5) * 2,
        y: -(e.clientY / size.height - 0.5) * 2,
      })
      setSpinSpeed(0.07) // Increase for faster spin on move
    }
    gl.domElement.addEventListener("pointermove", handlePointerMove)
    return () => gl.domElement.removeEventListener("pointermove", handlePointerMove)
  }, [size, gl])

  return (
    <>
      {/* Glassy solid */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.7, 0]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          roughness={0.08}
          metalness={0.7}
          transmission={0.92}
          thickness={1.3}
          clearcoat={1}
          clearcoatRoughness={0.05}
          ior={1.5}
          reflectivity={0.9}
          transparent
        />
      </mesh>
      {/* Wireframe overlay */}
      <lineSegments ref={wireRef}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.7, 0)]} />
        <lineBasicMaterial color="#fff" linewidth={1} transparent opacity={0.35} />
      </lineSegments>
      {/* Glow effect */}
      <mesh scale={1.22}>
        <icosahedronGeometry args={[1.7, 0]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} />
      </mesh>
    </>
  )
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.3} />
        <InteractiveIcosahedron />
      </Canvas>
    </div>
  )
}