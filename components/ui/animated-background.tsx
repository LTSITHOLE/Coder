'use client'

import { useEffect, useRef } from 'react'

interface AnimatedBackgroundProps {
  className?: string
}

export function AnimatedBackground({ className = "" }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particles configuration
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      fadeDirection: number
    }> = []

    const particleCount = 50
    const maxSize = 2
    const speed = 0.5

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * maxSize + 1,
        opacity: Math.random() * 0.5 + 0.1,
        fadeDirection: Math.random() > 0.5 ? 1 : -1
      })
    }

    // Geometric shapes for additional visual interest
    const shapes: Array<{
      x: number
      y: number
      rotation: number
      rotationSpeed: number
      size: number
      opacity: number
      type: 'square' | 'circle' | 'triangle'
    }> = []

    for (let i = 0; i < 8; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 100 + 50,
        opacity: 0.05,
        type: ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)] as 'square' | 'circle' | 'triangle'
      })
    }

    // Animation function
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get current theme
      const isDark = document.documentElement.classList.contains('dark')
      const particleColor = isDark ? 'rgba(255, 255, 255, ' : 'rgba(0, 0, 0, '
      const shapeColor = isDark ? 'rgba(255, 255, 255, ' : 'rgba(0, 0, 0, '

      // Draw and update particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Update opacity with fade effect
        particle.opacity += particle.fadeDirection * 0.005
        if (particle.opacity <= 0.1 || particle.opacity >= 0.6) {
          particle.fadeDirection *= -1
        }

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor + particle.opacity + ')'
        ctx.fill()
      })

      // Draw and update geometric shapes
      shapes.forEach(shape => {
        shape.rotation += shape.rotationSpeed

        ctx.save()
        ctx.translate(shape.x, shape.y)
        ctx.rotate(shape.rotation)
        ctx.globalAlpha = shape.opacity

        ctx.strokeStyle = shapeColor + shape.opacity + ')'
        ctx.lineWidth = 1

        switch (shape.type) {
          case 'square':
            ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
            break
          case 'circle':
            ctx.beginPath()
            ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2)
            ctx.stroke()
            break
          case 'triangle':
            ctx.beginPath()
            ctx.moveTo(0, -shape.size / 2)
            ctx.lineTo(-shape.size / 2, shape.size / 2)
            ctx.lineTo(shape.size / 2, shape.size / 2)
            ctx.closePath()
            ctx.stroke()
            break
        }

        ctx.restore()
      })

      // Draw connecting lines between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = particleColor + (0.1 * (1 - distance / 100)) + ')'
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ zIndex: -1 }}
    />
  )
}

export function GridBackground({ className = "" }: AnimatedBackgroundProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`} style={{ zIndex: -1 }}>
      <div className="absolute inset-0 bg-grid-pattern opacity-20 animate-pulse"></div>
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  )
}
