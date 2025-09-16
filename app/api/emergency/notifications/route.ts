import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

interface NotificationRequest {
  emergencyId: string
  type: "sms" | "email" | "push"
  recipient: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emergencyId, notifications } = body

    if (!emergencyId || !notifications || !Array.isArray(notifications)) {
      return NextResponse.json({ error: "Emergency ID and notifications array required" }, { status: 400 })
    }

    const db = await getDatabase()
    const notificationsCollection = db.collection("emergency_notifications")

    // Store notification records
    const notificationRecords = notifications.map((notification: NotificationRequest) => ({
      emergencyId,
      type: notification.type,
      recipient: notification.recipient,
      message: notification.message,
      status: "sent",
      sentAt: new Date(),
    }))

    await notificationsCollection.insertMany(notificationRecords)

    // In a real implementation, this would integrate with:
    // - SMS service (Twilio, AWS SNS)
    // - Email service (SendGrid, AWS SES)
    // - Push notification service (Firebase, OneSignal)

    console.log(`[EMERGENCY NOTIFICATIONS] Sent ${notifications.length} notifications for emergency ${emergencyId}`)

    return NextResponse.json({
      success: true,
      message: "Notifications sent successfully",
      count: notifications.length,
    })
  } catch (error) {
    console.error("Error sending notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
