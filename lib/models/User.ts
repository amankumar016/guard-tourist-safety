export interface User {
  _id?: string
  name: string
  email: string
  phone: string
  emergencyContact: string
  digitalId: string
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  riskProfile: "low" | "medium" | "high"
  preferences: {
    language: string
    notifications: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface EmergencyAlert {
  _id?: string
  userId: string
  type: "panic" | "medical" | "security" | "natural_disaster"
  location: {
    latitude: number
    longitude: number
    address: string
  }
  status: "active" | "responding" | "resolved"
  priority: "low" | "medium" | "high" | "critical"
  description?: string
  timestamp: Date
  responseTime?: Date
  resolvedAt?: Date
  assignedOfficer?: string
}

export interface SafetyZone {
  _id?: string
  name: string
  coordinates: {
    latitude: number
    longitude: number
  }[]
  riskLevel: "safe" | "moderate" | "high"
  description: string
  facilities: string[]
  emergencyServices: {
    police: string
    medical: string
    fire: string
  }
  lastUpdated: Date
}
