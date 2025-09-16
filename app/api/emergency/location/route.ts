import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emergencyId, location } = body

    if (!emergencyId || !location) {
      return NextResponse.json({ error: "Emergency ID and location required" }, { status: 400 })
    }

    const db = await getDatabase()
    const emergencies = db.collection("emergencies")

    // Update emergency with precise location
    await emergencies.updateOne(
      { _id: emergencyId },
      {
        $set: {
          location: {
            ...location,
            accuracy: location.accuracy || "high",
            timestamp: new Date(),
          },
          lastLocationUpdate: new Date(),
        },
      },
    )

    // In a real implementation, this would:
    // - Share location with emergency services
    // - Update dispatch systems
    // - Notify nearby responders

    console.log(`[EMERGENCY LOCATION] Updated location for emergency ${emergencyId}`)

    return NextResponse.json({
      success: true,
      message: "Location updated successfully",
    })
  } catch (error) {
    console.error("Error updating location:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
