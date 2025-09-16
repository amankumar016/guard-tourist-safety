import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, emergencyContact, language = "en" } = body

    if (!name || !email || !phone || !emergencyContact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection<User>("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Generate digital ID
    const digitalId = `GUARD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const newUser: User = {
      name,
      email,
      phone,
      emergencyContact,
      digitalId,
      riskProfile: "low",
      preferences: {
        language,
        notifications: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(newUser)

    return NextResponse.json({
      success: true,
      user: { ...newUser, _id: result.insertedId },
      digitalId,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const digitalId = searchParams.get("digitalId")
    const email = searchParams.get("email")

    if (!digitalId && !email) {
      return NextResponse.json({ error: "Digital ID or email required" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection<User>("users")

    const query = digitalId ? { digitalId } : { email }
    const user = await users.findOne(query)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
