import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthUser {
  id: string
  name: string
  email: string
  digitalId: string
  role: "tourist" | "admin" | "police"
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      digitalId: user.digitalId,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      digitalId: decoded.digitalId,
      role: decoded.role,
    }
  } catch (error) {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const db = await getDatabase()
    const users = db.collection<User & { password: string; role: string }>("users")

    const user = await users.findOne({ email })
    if (!user || !user.password) {
      return null
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return null
    }

    return {
      id: user._id?.toString() || "",
      name: user.name,
      email: user.email,
      digitalId: user.digitalId,
      role: (user.role as "tourist" | "admin" | "police") || "tourist",
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}
