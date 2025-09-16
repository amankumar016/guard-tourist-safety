import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import type { User } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, emergencyContact, password, language = "en", role = "tourist" } = body

    if (!name || !email || !phone || !emergencyContact || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection<User & { password: string; role: string }>("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate digital ID
    const digitalId = `GUARD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const newUser: User & { password: string; role: string } = {
      name,
      email,
      phone,
      emergencyContact,
      digitalId,
      password: hashedPassword,
      role,
      riskProfile: "low",
      preferences: {
        language,
        notifications: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(newUser)

    const authUser = {
      id: result.insertedId.toString(),
      name,
      email,
      digitalId,
      role: role as "tourist" | "admin" | "police",
    }

    const token = generateToken(authUser)

    const response = NextResponse.json({
      success: true,
      user: authUser,
      digitalId,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
