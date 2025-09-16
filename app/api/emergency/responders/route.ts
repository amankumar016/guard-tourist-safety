import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

interface Responder {
  id: string
  name: string
  type: "police" | "medical" | "fire" | "rescue"
  location: {
    latitude: number
    longitude: number
  }
  status: "available" | "busy" | "offline"
  estimatedArrival?: number // minutes
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const latitude = Number.parseFloat(searchParams.get("lat") || "0")
    const longitude = Number.parseFloat(searchParams.get("lng") || "0")
    const radius = Number.parseFloat(searchParams.get("radius") || "10") // km

    if (!latitude || !longitude) {
      return NextResponse.json({ error: "Latitude and longitude required" }, { status: 400 })
    }

    // Mock responders data - in real implementation, this would come from database
    const mockResponders: Responder[] = [
      {
        id: "resp-001",
        name: "Police Station Guwahati Central",
        type: "police",
        location: { latitude: 26.1445, longitude: 91.7362 },
        status: "available",
        estimatedArrival: 8,
      },
      {
        id: "resp-002",
        name: "GMCH Emergency Services",
        type: "medical",
        location: { latitude: 26.1395, longitude: 91.7295 },
        status: "available",
        estimatedArrival: 12,
      },
      {
        id: "resp-003",
        name: "Fire Station Paltan Bazaar",
        type: "fire",
        location: { latitude: 26.1505, longitude: 91.7405 },
        status: "available",
        estimatedArrival: 15,
      },
      {
        id: "resp-004",
        name: "Tourist Police Shillong",
        type: "police",
        location: { latitude: 25.5788, longitude: 91.8933 },
        status: "available",
        estimatedArrival: 25,
      },
    ]

    // Filter responders by distance (simplified calculation)
    const nearbyResponders = mockResponders.filter((responder) => {
      const distance = Math.sqrt(
        Math.pow(latitude - responder.location.latitude, 2) + Math.pow(longitude - responder.location.longitude, 2),
      )
      return distance <= radius / 111 // Rough conversion to degrees
    })

    return NextResponse.json({
      responders: nearbyResponders,
      count: nearbyResponders.length,
    })
  } catch (error) {
    console.error("Error fetching responders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emergencyId, responderIds } = body

    if (!emergencyId || !responderIds || !Array.isArray(responderIds)) {
      return NextResponse.json({ error: "Emergency ID and responder IDs required" }, { status: 400 })
    }

    const db = await getDatabase()
    const emergencies = db.collection("emergencies")

    // Update emergency with assigned responders
    await emergencies.updateOne(
      { _id: emergencyId },
      {
        $set: {
          assignedResponders: responderIds,
          dispatchTime: new Date(),
          status: "responding",
        },
      },
    )

    // In a real implementation, this would:
    // - Notify responders via their dispatch systems
    // - Update responder availability status
    // - Create dispatch records

    console.log(`[EMERGENCY DISPATCH] Assigned ${responderIds.length} responders to emergency ${emergencyId}`)

    return NextResponse.json({
      success: true,
      message: "Responders dispatched successfully",
      assignedCount: responderIds.length,
    })
  } catch (error) {
    console.error("Error dispatching responders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
