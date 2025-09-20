'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 8

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true, 
      antialias: true 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create universe
    const createUniverse = () => {
      // Create connections (line waves)
      const connectionGeometry = new THREE.BufferGeometry()
      const connectionPositions = []
      const connectionColors = []

      // Create animated wave-like connections
      const waveCount = 8
      const pointsPerWave = 50
      
      for (let wave = 0; wave < waveCount; wave++) {
        const waveRadius = 2 + wave * 0.5
        const waveHeight = 0.3
        
        for (let i = 0; i < pointsPerWave; i++) {
          const angle = (i / pointsPerWave) * Math.PI * 4
          const nextAngle = ((i + 1) / pointsPerWave) * Math.PI * 4
          
          // Current point
          const x1 = waveRadius * Math.cos(angle)
          const y1 = waveHeight * Math.sin(angle * 3)
          const z1 = waveRadius * Math.sin(angle)
          
          // Next point
          const x2 = waveRadius * Math.cos(nextAngle)
          const y2 = waveHeight * Math.sin(nextAngle * 3)
          const z2 = waveRadius * Math.sin(nextAngle)
          
          // Add connection line
          connectionPositions.push(x1, y1, z1, x2, y2, z2)

          // Connection color (orange gradient)
          const color = new THREE.Color()
          color.setHSL(0.08 + wave * 0.02, 0.8, 0.6 + wave * 0.1)
          connectionColors.push(color.r, color.g, color.b, color.r, color.g, color.b)
        }
      }

      connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3))
      connectionGeometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3))

      const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0xef4a3a,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      })

      const connectionSystem = new THREE.LineSegments(connectionGeometry, connectionMaterial)
      scene.add(connectionSystem)

      // Create wavy background
      const waveGeometry = new THREE.PlaneGeometry(20, 20, 50, 50)
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0xef4a3a,
        transparent: true,
        opacity: 0.05,
        wireframe: true,
        side: THREE.DoubleSide
      })

      const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial)
      waveMesh.rotation.x = -Math.PI / 2
      waveMesh.position.z = -5
      scene.add(waveMesh)

      return { connectionSystem, waveMesh }
    }

    const { connectionSystem, waveMesh } = createUniverse()

    // Animation
    let time = 0
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      time += 0.01

      // Update wave connections
      const connectionPositions = []
      const connectionColors = []

      const waveCount = 8
      const pointsPerWave = 50
      
      for (let wave = 0; wave < waveCount; wave++) {
        const waveRadius = 2 + wave * 0.5
        const waveHeight = 0.3
        
        for (let i = 0; i < pointsPerWave; i++) {
          const angle = (i / pointsPerWave) * Math.PI * 4 + time * 0.5
          const nextAngle = ((i + 1) / pointsPerWave) * Math.PI * 4 + time * 0.5
          
          // Current point with animation
          const x1 = waveRadius * Math.cos(angle)
          const y1 = waveHeight * Math.sin(angle * 3 + time)
          const z1 = waveRadius * Math.sin(angle)
          
          // Next point with animation
          const x2 = waveRadius * Math.cos(nextAngle)
          const y2 = waveHeight * Math.sin(nextAngle * 3 + time)
          const z2 = waveRadius * Math.sin(nextAngle)
          
          // Add connection line
          connectionPositions.push(x1, y1, z1, x2, y2, z2)

          // Connection color (orange gradient)
          const color = new THREE.Color()
          color.setHSL(0.08 + wave * 0.02, 0.8, 0.6 + wave * 0.1)
          connectionColors.push(color.r, color.g, color.b, color.r, color.g, color.b)
        }
      }

      // Update connection geometry
      connectionSystem.geometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3))
      connectionSystem.geometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3))

      // Update wavy background
      if (waveMesh) {
        const positions = waveMesh.geometry.attributes.position.array
        
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i]
          const y = positions[i + 1]
          
          // Create wavy effect
          positions[i + 2] = Math.sin(x + time) * 0.5 + Math.sin(y + time * 0.5) * 0.3
        }
        
        waveMesh.geometry.attributes.position.needsUpdate = true
      }
      
      // Rotate entire system
      scene.rotation.y += 0.001
      scene.rotation.x += 0.0005

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-10" />
      <div className="relative z-20 max-w-container mx-auto px-container text-center">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="hero-line block opacity-0 translate-y-8 animate-fade-in-up">
              Building the Future
            </span>
            <span className="hero-line block opacity-0 translate-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Through Innovation
            </span>
          </h1>
          <p className="hero-subtitle opacity-0 translate-y-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            A next-generation family global holding company investing in real assets, 
            cutting-edge technology, and entrepreneurial ventures with patient capital 
            and long-term vision.
          </p>
          <div className="hero-cta opacity-0 translate-y-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <a href="#contact" className="btn btn-primary">Start a Conversation</a>
            <a href="#sectors" className="btn btn-secondary">Explore Sectors</a>
          </div>
        </div>
      </div>
      <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <div className="scroll-arrow animate-scroll-bounce" />
      </div>

      <style jsx>{`
        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 3vw, 1.3rem);
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto 3rem;
        }

        .hero-cta {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .scroll-arrow {
          width: 2px;
          height: 40px;
          background: var(--color-accent);
          position: relative;
        }

        .scroll-arrow::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -3px;
          width: 8px;
          height: 8px;
          border-right: 2px solid var(--color-accent);
          border-bottom: 2px solid var(--color-accent);
          transform: rotate(45deg);
        }

        @media (max-width: 768px) {
          .hero-cta {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </section>
  )
}
