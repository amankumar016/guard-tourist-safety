import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { EmergencyAlert } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, location, description, priority = "high" } = body

    if (!userId || !type || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const emergencies = db.collection<EmergencyAlert>("emergencies")

    const newEmergency: EmergencyAlert = {
      userId,
      type,
      location,
      status: "active",
      priority,
      description,
      timestamp: new Date(),
    }

    const result = await emergencies.insertOne(newEmergency)

    // In a real app, this would trigger notifications to emergency services
    console.log(`[EMERGENCY ALERT] ${type.toUpperCase()} - User: ${userId} - Location: ${location.address}`)

    return NextResponse.json({
      success: true,
      emergencyId: result.insertedId,
      message: "Emergency alert created successfully",
    })
  } catch (error) {
    console.error("Error creating emergency alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")

    const db = await getDatabase()
    const emergencies = db.collection<EmergencyAlert>("emergencies")

    const query: any = {}
    if (status) query.status = status
    if (userId) query.userId = userId

    const alerts = await emergencies.find(query).sort({ timestamp: -1 }).limit(50).toArray()

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Error fetching emergency alerts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { emergencyId, status, assignedOfficer } = body

    if (!emergencyId || !status) {
      return NextResponse.json({ error: "Emergency ID and status required" }, { status: 400 })
    }

    const db = await getDatabase()
    const emergencies = db.collection<EmergencyAlert>("emergencies")

    const updateData: any = { status }
    if (status === "responding") {
      updateData.responseTime = new Date()
    }
    if (status === "resolved") {
      updateData.resolvedAt = new Date()
    }
    if (assignedOfficer) {
      updateData.assignedOfficer = assignedOfficer
    }

    await emergencies.updateOne({ _id: emergencyId }, { $set: updateData })

    return NextResponse.json({
      success: true,
      message: "Emergency status updated",
    })
  } catch (error) {
    console.error("Error updating emergency:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
