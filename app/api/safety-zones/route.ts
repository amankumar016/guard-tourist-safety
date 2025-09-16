import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { SafetyZone } from "@/lib/models/User"

// Northeast India safety zones data
const northeastZones: Omit<SafetyZone, "_id">[] = [
  {
    name: "Guwahati Safe Zone",
    coordinates: [
      { latitude: 26.1445, longitude: 91.7362 },
      { latitude: 26.1845, longitude: 91.7762 },
      { latitude: 26.1045, longitude: 91.7962 },
      { latitude: 26.1045, longitude: 91.6962 },
    ],
    riskLevel: "safe",
    description: "Main commercial and tourist hub with excellent security infrastructure",
    facilities: ["Police Station", "Hospital", "Tourist Information", "Hotels", "ATMs"],
    emergencyServices: {
      police: "100",
      medical: "108",
      fire: "101",
    },
    lastUpdated: new Date(),
  },
  {
    name: "Shillong Tourist Area",
    coordinates: [
      { latitude: 25.5788, longitude: 91.8933 },
      { latitude: 25.6088, longitude: 91.9233 },
      { latitude: 25.5488, longitude: 91.9333 },
      { latitude: 25.5488, longitude: 91.8533 },
    ],
    riskLevel: "safe",
    description: "Popular hill station with good tourist facilities",
    facilities: ["Tourist Police", "Medical Center", "Hotels", "Restaurants"],
    emergencyServices: {
      police: "100",
      medical: "108",
      fire: "101",
    },
    lastUpdated: new Date(),
  },
  {
    name: "Kaziranga Buffer Zone",
    coordinates: [
      { latitude: 26.5775, longitude: 93.1717 },
      { latitude: 26.6175, longitude: 93.2117 },
      { latitude: 26.5375, longitude: 93.2317 },
      { latitude: 26.5375, longitude: 93.1317 },
    ],
    riskLevel: "moderate",
    description: "Wildlife area with moderate risk due to animal encounters",
    facilities: ["Forest Office", "Basic Medical", "Eco-lodges"],
    emergencyServices: {
      police: "100",
      medical: "108",
      fire: "101",
    },
    lastUpdated: new Date(),
  },
  {
    name: "Remote Border Areas",
    coordinates: [
      { latitude: 27.0, longitude: 95.0 },
      { latitude: 27.2, longitude: 95.2 },
      { latitude: 26.8, longitude: 95.2 },
      { latitude: 26.8, longitude: 94.8 },
    ],
    riskLevel: "high",
    description: "Remote border regions with limited infrastructure",
    facilities: ["Border Outpost", "Basic Communication"],
    emergencyServices: {
      police: "100",
      medical: "108",
      fire: "101",
    },
    lastUpdated: new Date(),
  },
  {
    name: "Tawang Monastery Area",
    coordinates: [
      { latitude: 27.5856, longitude: 91.8597 },
      { latitude: 27.6056, longitude: 91.8797 },
      { latitude: 27.5656, longitude: 91.8997 },
      { latitude: 27.5656, longitude: 91.8197 },
    ],
    riskLevel: "moderate",
    description: "High altitude area with weather-related risks",
    facilities: ["Monastery", "Guest House", "Medical Post"],
    emergencyServices: {
      police: "100",
      medical: "108",
      fire: "101",
    },
    lastUpdated: new Date(),
  },
]

export async function GET() {
  try {
    const db = await getDatabase()
    const zones = db.collection<SafetyZone>("safety_zones")

    // Check if zones exist, if not, seed the database
    const count = await zones.countDocuments()
    if (count === 0) {
      await zones.insertMany(northeastZones)
    }

    const safetyZones = await zones.find({}).toArray()

    return NextResponse.json({ zones: safetyZones })
  } catch (error) {
    console.error("Error fetching safety zones:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latitude, longitude } = body

    if (!latitude || !longitude) {
      return NextResponse.json({ error: "Latitude and longitude required" }, { status: 400 })
    }

    const db = await getDatabase()
    const zones = db.collection<SafetyZone>("safety_zones")

    // Find the zone that contains the given coordinates
    // This is a simplified point-in-polygon check
    const allZones = await zones.find({}).toArray()

    let currentZone = null
    let minDistance = Number.POSITIVE_INFINITY

    for (const zone of allZones) {
      // Calculate distance to zone center (simplified)
      const centerLat = zone.coordinates.reduce((sum, coord) => sum + coord.latitude, 0) / zone.coordinates.length
      const centerLng = zone.coordinates.reduce((sum, coord) => sum + coord.longitude, 0) / zone.coordinates.length

      const distance = Math.sqrt(Math.pow(latitude - centerLat, 2) + Math.pow(longitude - centerLng, 2))

      if (distance < minDistance) {
        minDistance = distance
        currentZone = zone
      }
    }

    return NextResponse.json({
      currentZone,
      riskLevel: currentZone?.riskLevel || "moderate",
      nearbyFacilities: currentZone?.facilities || [],
    })
  } catch (error) {
    console.error("Error checking location safety:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
