"use client"

import { useState, useCallback } from "react"

interface EmergencyLocation {
  latitude: number
  longitude: number
  address: string
  accuracy?: string
}

interface EmergencyData {
  type: "panic" | "medical" | "security" | "natural_disaster"
  location: EmergencyLocation
  description?: string
  priority?: "low" | "medium" | "high" | "critical"
}

export function useEmergency() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [emergencyId, setEmergencyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const triggerEmergency = useCallback(async (emergencyData: EmergencyData) => {
    setLoading(true)
    try {
      // Get current location if not provided
      let location = emergencyData.location
      if (!location.latitude || !location.longitude) {
        location = await getCurrentLocation()
      }

      // Create emergency alert
      const response = await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "current-user", // This would come from auth context
          type: emergencyData.type,
          location,
          description: emergencyData.description,
          priority: emergencyData.priority || "high",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setEmergencyId(data.emergencyId)
        setIsEmergencyActive(true)

        // Start emergency response sequence
        await initiateEmergencyResponse(data.emergencyId, location)

        return { success: true, emergencyId: data.emergencyId }
      } else {
        throw new Error("Failed to create emergency alert")
      }
    } catch (error) {
      console.error("Emergency trigger failed:", error)
      return { success: false, error: "Failed to trigger emergency" }
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelEmergency = useCallback(async () => {
    if (!emergencyId) return

    try {
      await fetch("/api/emergency", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emergencyId,
          status: "cancelled",
        }),
      })

      setIsEmergencyActive(false)
      setEmergencyId(null)
    } catch (error) {
      console.error("Failed to cancel emergency:", error)
    }
  }, [emergencyId])

  const getCurrentLocation = (): Promise<EmergencyLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Current Location",
            accuracy: position.coords.accuracy < 100 ? "high" : "medium",
          })
        },
        (error) => {
          // Fallback to approximate location
          resolve({
            latitude: 26.1445,
            longitude: 91.7362,
            address: "Guwahati, Assam (Approximate)",
            accuracy: "low",
          })
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    })
  }

  const initiateEmergencyResponse = async (emergencyId: string, location: EmergencyLocation) => {
    try {
      // Update location
      await fetch("/api/emergency/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emergencyId, location }),
      })

      // Send notifications
      await fetch("/api/emergency/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emergencyId,
          notifications: [
            {
              type: "sms",
              recipient: "+91-9999999999",
              message: "Emergency alert activated. Location shared with authorities.",
            },
            {
              type: "email",
              recipient: "emergency@example.com",
              message: "Emergency alert: Immediate assistance required.",
            },
          ],
        }),
      })

      // Get nearby responders
      const respondersResponse = await fetch(
        `/api/emergency/responders?lat=${location.latitude}&lng=${location.longitude}&radius=20`,
      )

      if (respondersResponse.ok) {
        const respondersData = await respondersResponse.json()

        // Dispatch responders
        if (respondersData.responders.length > 0) {
          await fetch("/api/emergency/responders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emergencyId,
              responderIds: respondersData.responders.slice(0, 2).map((r: any) => r.id),
            }),
          })
        }
      }
    } catch (error) {
      console.error("Emergency response initiation failed:", error)
    }
  }

  return {
    isEmergencyActive,
    emergencyId,
    loading,
    triggerEmergency,
    cancelEmergency,
  }
}
