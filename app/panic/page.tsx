"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, MapPin, Clock, CheckCircle, Users } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { useEmergency } from "@/hooks/use-emergency"
import LanguageSelector from "@/components/language-selector"

export default function PanicPage() {
  const { t } = useTranslation()
  const { isEmergencyActive, emergencyId, loading, triggerEmergency, cancelEmergency } = useEmergency()
  const [countdown, setCountdown] = useState(10)
  const [showCountdown, setShowCountdown] = useState(false)
  const [emergencySteps, setEmergencySteps] = useState([
    { step: "Alert sent to emergency services", completed: false, time: null },
    { step: "Location shared with authorities", completed: false, time: null },
    { step: "Emergency contacts notified", completed: false, time: null },
    { step: "Nearby responders alerted", completed: false, time: null },
    { step: "Help dispatched", completed: false, time: null },
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (showCountdown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (showCountdown && countdown === 0) {
      // Trigger actual emergency
      handleEmergencyTrigger()
      setShowCountdown(false)
    }
    return () => clearInterval(interval)
  }, [showCountdown, countdown])

  useEffect(() => {
    if (isEmergencyActive) {
      simulateEmergencyResponse()
    }
  }, [isEmergencyActive])

  const simulateEmergencyResponse = () => {
    const steps = [...emergencySteps]
    steps.forEach((step, index) => {
      setTimeout(
        () => {
          setEmergencySteps((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], completed: true, time: new Date().toLocaleTimeString() }
            return updated
          })
        },
        (index + 1) * 2000,
      )
    })
  }

  const handlePanicActivation = () => {
    setShowCountdown(true)
    setCountdown(10)
  }

  const handleEmergencyTrigger = async () => {
    const result = await triggerEmergency({
      type: "panic",
      location: {
        latitude: 0,
        longitude: 0,
        address: "",
      },
      description: "Panic button activated",
      priority: "critical",
    })

    if (!result.success) {
      alert("Failed to trigger emergency. Please try again.")
      setShowCountdown(false)
      setCountdown(10)
    }
  }

  const handleCancelPanic = async () => {
    if (isEmergencyActive) {
      await cancelEmergency()
    }
    setShowCountdown(false)
    setCountdown(10)
    setEmergencySteps(emergencySteps.map((step) => ({ ...step, completed: false, time: null })))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">GUARD</h1>
                <p className="text-sm text-gray-600">Smart Tourist Safety</p>
              </div>
            </Link>

            <nav className="flex items-center space-x-2">
              <Link href="/tourist">
                <Button variant="outline">{t("tourist")}</Button>
              </Link>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                {t("panic").toUpperCase()}
              </Button>
              <Link href="/saarthi">
                <Button variant="outline" className="flex items-center space-x-1 bg-transparent">
                  <MapPin className="h-4 w-4" />
                  <span>{t("saarthi")}</span>
                </Button>
              </Link>
              <Link href="/track-panic">
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Track Panic Progress
                </Button>
              </Link>
              <Link href="/police">
                <Button variant="outline">{t("police")} Dashboard</Button>
              </Link>
              <Link href="/ai-guide">
                <Button className="bg-green-600 hover:bg-green-700">{t("aiGuide")}</Button>
              </Link>
              <LanguageSelector />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showCountdown && !isEmergencyActive ? (
          /* Panic Activation Screen */
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t("emergencyAlert")} {t("panicButton")}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Press the button below if you are in immediate danger. Emergency services will be notified instantly.
              </p>
            </div>

            <div className="space-y-6">
              <Button
                onClick={handlePanicActivation}
                disabled={loading}
                className="w-64 h-64 rounded-full bg-red-600 hover:bg-red-700 text-white text-2xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="flex flex-col items-center space-y-2">
                  <AlertTriangle className="h-16 w-16" />
                  <span>{t("panicButton").toUpperCase()}</span>
                  <span className="text-lg font-normal">Press & Hold</span>
                </div>
              </Button>

              <div className="max-w-md mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      What happens when you press {t("panicButton").toUpperCase()}?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span>Emergency services are alerted immediately</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span>Your location is shared with authorities</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span>Emergency contacts are notified</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span>Nearby responders are dispatched</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* Emergency Active Screen */
          <div className="space-y-6">
            {showCountdown ? (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-2xl text-red-800 flex items-center space-x-2">
                    <AlertTriangle className="h-6 w-6" />
                    <span>{t("emergencyAlert")} Activating</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-6xl font-bold text-red-600">{countdown}</div>
                  <p className="text-lg text-red-700">Emergency services will be notified in {countdown} seconds</p>
                  <Button
                    onClick={handleCancelPanic}
                    variant="outline"
                    className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {t("cancel")} {t("emergencyAlert")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-2xl text-red-800 flex items-center space-x-2">
                    <AlertTriangle className="h-6 w-6" />
                    <span>{t("emergencyActivated")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-red-600 text-white">EMERGENCY ACTIVE</Badge>
                    <span className="text-sm text-red-700">Started at {new Date().toLocaleTimeString()}</span>
                  </div>
                  <p className="text-red-700 mb-4">
                    {t("helpOnWay")}. {t("stayCalm")}.
                  </p>
                  <Button
                    onClick={handleCancelPanic}
                    variant="outline"
                    className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {t("cancel")} Emergency (False Alarm)
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Emergency Response Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Emergency Response Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencySteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-green-600" : "bg-gray-300"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <span className="text-xs text-white">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.completed ? "text-green-800" : "text-gray-600"}`}>
                          {step.step}
                        </p>
                        {step.time && <p className="text-sm text-gray-500">Completed at {step.time}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Your Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">Shared with emergency services:</p>
                  <p className="font-medium">Latitude: 26.1445° N</p>
                  <p className="font-medium">Longitude: 91.7362° E</p>
                  <p className="text-sm text-gray-600 mt-2">Guwahati, Assam, India</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Contacts Notified</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Emergency Services</span>
                      <Badge className="bg-green-100 text-green-800">Notified</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Emergency Contact 1</span>
                      <Badge className="bg-green-100 text-green-800">Notified</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Emergency Contact 2</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
