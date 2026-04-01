'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const createUniverse = () => {
      const connectionGeometry = new THREE.BufferGeometry()
      const connectionPositions: number[] = []
      const connectionColors: number[] = []

      const waveCount = 8
      const pointsPerWave = 50

      for (let wave = 0; wave < waveCount; wave++) {
        const waveRadius = 2 + wave * 0.5
        const waveHeight = 0.3

        for (let i = 0; i < pointsPerWave; i++) {
          const angle = (i / pointsPerWave) * Math.PI * 4
          const nextAngle = ((i + 1) / pointsPerWave) * Math.PI * 4

          const x1 = waveRadius * Math.cos(angle)
          const y1 = waveHeight * Math.sin(angle * 3)
          const z1 = waveRadius * Math.sin(angle)

          const x2 = waveRadius * Math.cos(nextAngle)
          const y2 = waveHeight * Math.sin(nextAngle * 3)
          const z2 = waveRadius * Math.sin(nextAngle)

          connectionPositions.push(x1, y1, z1, x2, y2, z2)

          const color = new THREE.Color()
          color.setHSL(0.02 + wave * 0.015, 0.75, 0.52)
          connectionColors.push(color.r, color.g, color.b, color.r, color.g, color.b)
        }
      }

      connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3))
      connectionGeometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3))

      const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0xe03d2f,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      })

      const connectionSystem = new THREE.LineSegments(connectionGeometry, connectionMaterial)
      scene.add(connectionSystem)

      const waveGeometry = new THREE.PlaneGeometry(20, 20, 50, 50)
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0xe03d2f,
        transparent: true,
        opacity: 0.04,
        wireframe: true,
        side: THREE.DoubleSide,
      })

      const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial)
      waveMesh.rotation.x = -Math.PI / 2
      waveMesh.position.z = -5
      scene.add(waveMesh)

      return { connectionSystem, waveMesh }
    }

    const { connectionSystem, waveMesh } = createUniverse()

    let time = 0
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      time += 0.01

      const connectionPositions: number[] = []
      const connectionColors: number[] = []

      const waveCount = 8
      const pointsPerWave = 50

      for (let wave = 0; wave < waveCount; wave++) {
        const waveRadius = 2 + wave * 0.5
        const waveHeight = 0.3

        for (let i = 0; i < pointsPerWave; i++) {
          const angle = (i / pointsPerWave) * Math.PI * 4 + time * 0.5
          const nextAngle = ((i + 1) / pointsPerWave) * Math.PI * 4 + time * 0.5

          const x1 = waveRadius * Math.cos(angle)
          const y1 = waveHeight * Math.sin(angle * 3 + time)
          const z1 = waveRadius * Math.sin(angle)

          const x2 = waveRadius * Math.cos(nextAngle)
          const y2 = waveHeight * Math.sin(nextAngle * 3 + time)
          const z2 = waveRadius * Math.sin(nextAngle)

          connectionPositions.push(x1, y1, z1, x2, y2, z2)

          const color = new THREE.Color()
          color.setHSL(0.02 + wave * 0.015, 0.75, 0.52)
          connectionColors.push(color.r, color.g, color.b, color.r, color.g, color.b)
        }
      }

      connectionSystem.geometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3))
      connectionSystem.geometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3))

      if (waveMesh) {
        const positions = waveMesh.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i]
          const y = positions[i + 1]

          positions[i + 2] = Math.sin(x + time) * 0.5 + Math.sin(y + time * 0.5) * 0.3
        }

        waveMesh.geometry.attributes.position.needsUpdate = true
      }

      scene.rotation.y += 0.001
      scene.rotation.x += 0.0005

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-bg via-white to-bg-light">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none" />
      <div className="absolute inset-0 z-[11] bg-gradient-to-b from-transparent via-transparent to-bg-light/90 pointer-events-none" />
      <div className="relative z-20 max-w-container mx-auto px-container text-center pt-8">
        <div className="hero-text">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-6 opacity-0 translate-y-6 animate-fade-in-up">
            UK family global holding company
          </p>
          <h1 className="hero-title">
            <span className="hero-line block opacity-0 translate-y-8 animate-fade-in-up">
              Building the Future
            </span>
            <span className="hero-line block opacity-0 translate-y-8 animate-fade-in-up text-accent" style={{ animationDelay: '0.15s' }}>
              Through Innovation
            </span>
          </h1>
          <p className="hero-subtitle opacity-0 translate-y-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            A next-generation family global holding company investing in real assets,
            cutting-edge technology, and entrepreneurial ventures with patient capital
            and long-term vision.
          </p>
          <div className="hero-cta opacity-0 translate-y-8 animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
            <a href="#contact" className="btn btn-primary">Start a Conversation</a>
            <a href="#sectors" className="btn btn-secondary">Explore Sectors</a>
          </div>
        </div>
      </div>
      <div className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="scroll-mouse flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Scroll</span>
          <div className="scroll-arrow animate-scroll-bounce" />
        </div>
      </div>

      <style jsx>{`
        .hero-title {
          font-size: clamp(2.5rem, 7vw, 3.75rem);
          font-weight: 700;
          line-height: 1.08;
          margin-bottom: 1.75rem;
          letter-spacing: -0.03em;
          color: var(--color-text);
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 2.5vw, 1.2rem);
          color: var(--color-text-muted);
          max-width: 34rem;
          margin: 0 auto 2.5rem;
          font-weight: 400;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .scroll-arrow {
          width: 1.5px;
          height: 36px;
          background: linear-gradient(180deg, var(--color-accent), transparent);
          position: relative;
          border-radius: 2px;
        }

        .scroll-arrow::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 7px;
          height: 7px;
          border-right: 1.5px solid var(--color-accent);
          border-bottom: 1.5px solid var(--color-accent);
          transform: translate(-50%, 0) rotate(45deg);
        }

        @media (max-width: 768px) {
          .hero-cta {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </section>
  )
}
