"use client"

import { useEffect, useRef } from "react"

const BAR_COUNT = 64

export function AudioCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef(0.5)
    const phaseRef = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let raf = 0

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        resize()
        window.addEventListener("resize", resize)

        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = (e.clientX - rect.left) / rect.width
        }

        window.addEventListener("mousemove", onMove)

        const draw = () => {
            const w = canvas.getBoundingClientRect().width
            const h = canvas.getBoundingClientRect().height
            phaseRef.current += 0.035

            ctx.clearRect(0, 0, w, h)

            const padTop = 20
            const padBottom = 8
            const drawH = h - padTop - padBottom
            const baseY = h - padBottom

            const gap = w / BAR_COUNT
            const mx = mouseRef.current

            for (let i = 0; i < BAR_COUNT; i++) {
                const t = i / BAR_COUNT
                const dist = Math.abs(t - mx)
                const boost = Math.max(0, 1 - dist * 2.5)
                const wave =
                    Math.sin(phaseRef.current + i * 0.35) * 0.3 +
                    Math.sin(phaseRef.current * 1.7 + i * 0.12) * 0.2 +
                    0.35
                const x = i * gap + gap * 0.15
                const barW = gap * 0.7
                const rawHeight = (wave + boost * 0.45) * drawH
                const height = Math.min(rawHeight, drawH - barW / 2)

                const grad = ctx.createLinearGradient(0, baseY, 0, baseY - height)
                grad.addColorStop(0, "rgba(124, 92, 252, 0.15)")
                grad.addColorStop(0.5, "rgba(124, 92, 252, 0.55)")
                grad.addColorStop(1, "rgba(244, 114, 182, 0.75)")

                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.roundRect(x, baseY - height, barW, height, barW / 2)
                ctx.fill()
            }

            raf = requestAnimationFrame(draw)
        }

        raf = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("resize", resize)
            window.removeEventListener("mousemove", onMove)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
            aria-hidden
        />
    )
}
