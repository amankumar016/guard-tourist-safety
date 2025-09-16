"use client"

import { useEffect } from "react"

export default function WaterfallAnimation() {
  useEffect(() => {
    const createDrop = () => {
      const drop = document.createElement("div")
      drop.className = "waterfall-drop"
      drop.style.left = Math.random() * 100 + "%"
      drop.style.height = Math.random() * 100 + 50 + "px"
      drop.style.animationDelay = Math.random() * 2 + "s"

      const container = document.querySelector(".waterfall-container")
      if (container) {
        container.appendChild(drop)

        setTimeout(() => {
          if (container.contains(drop)) {
            container.removeChild(drop)
          }
        }, 4000)
      }
    }

    const interval = setInterval(createDrop, 200)

    return () => clearInterval(interval)
  }, [])

  return <div className="waterfall-container" />
}
