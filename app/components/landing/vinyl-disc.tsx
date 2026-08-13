"use client"

import { useRef } from "react"

export function VinylDisc() {
    const tiltRef = useRef<HTMLDivElement>(null)

    function handleMove(e: React.MouseEvent<HTMLDivElement>) {
        const el = tiltRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `rotateX(${-y * 18}deg) rotateY(${x * 18}deg)`
    }

    function handleLeave() {
        const el = tiltRef.current
        if (!el) return
        el.style.transform = "rotateX(0deg) rotateY(0deg)"
    }

    return (
        <div
            className="vf-vinyl-scene select-none"
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            <div className="vf-vinyl-spin">
                <div ref={tiltRef} className="vf-vinyl">
                    <div className="vf-vinyl-grooves" />
                    <div className="vf-vinyl-shine" />
                    <div className="vf-vinyl-label">
                        <span className="vf-vinyl-label-text">VIBEFLOW</span>
                        <span className="vf-vinyl-label-rpm">33⅓ RPM</span>
                    </div>
                    <div className="vf-vinyl-hole" />
                </div>
            </div>
            <div className="vf-vinyl-shadow" />
        </div>
    )
}
