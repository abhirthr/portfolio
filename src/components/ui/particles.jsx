import { useEffect, useRef } from "react"

function hexToRgb(hex) {
  hex = hex.replace("#", "")
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("")
  }
  const hexInt = parseInt(hex, 16)
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255]
}

const remapValue = (value, start1, end1, start2, end2) => {
  const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
  return remapped > 0 ? remapped : 0
}

// Canvas particle field that drifts and leans toward the mouse.
// All drawing state lives in one effect: the mouse is tracked through a ref
// (no re-render per mousemove) and a ResizeObserver keeps the canvas matched
// to its parent as the page content grows.
export function Particles({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  color = "#000000",
  vx = 0,
  vy = 0,
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return undefined
    const ctx = canvas.getContext("2d")
    const parent = container.parentElement || container
    const rgb = hexToRgb(color).join(", ")
    const MAX_PIXELS = 16e6 // stay under iOS Safari's canvas area limit
    let dpr = 1
    const mouse = { x: 0, y: 0 }
    const canvasSize = { w: 0, h: 0 }
    let circles = []
    let frame = null

    const circleParams = () => ({
      x: Math.floor(Math.random() * canvasSize.w),
      y: Math.floor(Math.random() * canvasSize.h),
      translateX: 0,
      translateY: 0,
      size: Math.floor(Math.random() * 2) + size,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    })

    const drawCircle = (circle) => {
      const { x, y, translateX, translateY, size: s, alpha } = circle
      ctx.translate(translateX, translateY)
      ctx.beginPath()
      ctx.arc(x, y, s, 0, 2 * Math.PI)
      ctx.fillStyle = `rgba(${rgb}, ${alpha})`
      ctx.fill()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      const w = parent.offsetWidth
      const h = parent.offsetHeight
      if (w === canvasSize.w && h === canvasSize.h) return
      canvasSize.w = w
      canvasSize.h = h
      dpr = Math.min(window.devicePixelRatio || 1, Math.sqrt(MAX_PIXELS / Math.max(1, w * h)))
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      circles = Array.from({ length: quantity }, circleParams)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.h)
      circles = circles.map((circle) => {
        const closestEdge = Math.min(
          circle.x + circle.translateX - circle.size,
          canvasSize.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          canvasSize.h - circle.y - circle.translateY - circle.size,
        )
        const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2))
        if (remapClosestEdge > 1) {
          circle.alpha = Math.min(circle.alpha + 0.02, circle.targetAlpha)
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge
        }
        circle.x += circle.dx + vx
        circle.y += circle.dy + vy
        circle.translateX += (mouse.x / (staticity / circle.magnetism) - circle.translateX) / ease
        circle.translateY += (mouse.y / (staticity / circle.magnetism) - circle.translateY) / ease
        drawCircle(circle)

        const outside =
          circle.x < -circle.size ||
          circle.x > canvasSize.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSize.h + circle.size
        return outside ? circleParams() : circle
      })
      frame = window.requestAnimationFrame(animate)
    }

    const onMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left - canvasSize.w / 2
      const y = event.clientY - rect.top - canvasSize.h / 2
      if (Math.abs(x) < canvasSize.w / 2 && Math.abs(y) < canvasSize.h / 2) {
        mouse.x = x
        mouse.y = y
      }
    }

    init()
    animate()
    const observer = new ResizeObserver(init)
    observer.observe(parent)
    window.addEventListener("mousemove", onMouseMove)

    return () => {
      observer.disconnect()
      window.removeEventListener("mousemove", onMouseMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [color, quantity, staticity, ease, size, vx, vy])

  return (
    <div className={className} ref={containerRef} aria-hidden="true" style={{ pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
