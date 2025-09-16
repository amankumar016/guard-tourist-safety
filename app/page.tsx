"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, MapPin, Users, Settings, MessageSquare, Share, AlertTriangle, Star } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import LanguageSelector from "@/components/language-selector"

export default function HomePage() {
  const { t } = useTranslation()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")
  const [locationConsent, setLocationConsent] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleGenerateDigitalID = async () => {
    if (!fullName || !email || !phoneNumber || !emergencyContact || !locationConsent) {
      alert("Please fill all fields and consent to location use")
      return
    }

    setIsRegistering(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          phone: phoneNumber,
          emergencyContact,
          language: "en", // Will be updated with actual language selection
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Digital ID generated successfully! Your ID: ${data.digitalId}`)
        // Reset form
        setFullName("")
        setEmail("")
        setPhoneNumber("")
        setEmergencyContact("")
        setLocationConsent(false)
      } else {
        alert(data.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-600">
      {/* Navigation Header */}
      <header className="bg-slate-700 border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">GUARD</span>
            </div>

            <nav className="flex items-center space-x-1 text-sm">
              <Button variant="ghost" className="text-white hover:bg-slate-600 px-3 py-1 h-8">
                {t("home")}
              </Button>
              <Link href="/tourist">
                <Button variant="ghost" className="text-white hover:bg-slate-600 px-3 py-1 h-8">
                  {t("tourist")}
                </Button>
              </Link>
              <Link href="/panic">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 h-8 text-sm">
                  {t("panic").toUpperCase()}
                </Button>
              </Link>
              <Link href="/saarthi">
                <Button variant="ghost" className="text-white hover:bg-slate-600 px-3 py-1 h-8">
                  {t("saarthi")}
                </Button>
              </Link>
              <Link href="/track-panic">
                <Button variant="ghost" className="text-white hover:bg-slate-600 px-3 py-1 h-8">
                  Track Progress
                </Button>
              </Link>
              <Link href="/police">
                <Button variant="ghost" className="text-white hover:bg-slate-600 px-3 py-1 h-8">
                  {t("police")}
                </Button>
              </Link>
              <Link href="/ai-guide">
                <Button variant="ghost" className="text-white hover:bg-slate-600 px-3 py-1 h-8">
                  {t("aiGuide")}
                </Button>
              </Link>
              <LanguageSelector />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <h1 className="text-5xl font-bold text-white mb-2">{t("safeTrip")}</h1>
          <p className="text-xl text-slate-300 mb-1">Emergency SOS & {t("smartTouristSafety")}</p>
          <p className="text-slate-400">
            Your digital guardian for safe travels in Northeast India's breathtaking landscapes
          </p>

          {/* Live Status Widget */}
          <div className="absolute top-0 right-0 bg-slate-700 rounded-lg p-3 border border-slate-600">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-white text-sm font-medium">{t("liveStatus")}</span>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Active</span>
            </div>
            <div className="w-32 h-16 bg-slate-600 rounded border border-slate-500"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Register Section */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h2 className="text-xl font-semibold text-white mb-4">{t("register")}</h2>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder={t("fullName")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
              <Input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
              <Input
                type="tel"
                placeholder={t("phone")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
              <Input
                type="tel"
                placeholder={t("emergencyContact")}
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="locationConsent"
                  checked={locationConsent}
                  onCheckedChange={setLocationConsent}
                  className="border-slate-500 data-[state=checked]:bg-blue-500"
                />
                <label htmlFor="locationConsent" className="text-slate-300 text-sm">
                  I consent to location use for my safety
                </label>
              </div>
              <Button
                onClick={handleGenerateDigitalID}
                disabled={isRegistering}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRegistering ? t("loading") : t("registerNow")}
              </Button>
            </div>
          </div>

          {/* Smart Tourist Safety Section */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h2 className="text-xl font-semibold text-white mb-4">{t("smartTouristSafety")}</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">Fast QR-based identification</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-slate-300">Instant panic alerts</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Secure blockchain-backed audit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            {t("quickActions")}
          </h2>
          <div className="space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
              <Shield className="h-4 w-4 mr-3" />
              Issue Digital ID (Kiosk)
              <span className="ml-auto text-xs">Generate your quick ID for identification</span>
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-gray-800 justify-start border-slate-500"
            >
              <AlertTriangle className="h-4 w-4 mr-3" />
              {t("emergencyAlert")}
              <span className="ml-auto text-xs">Quick voice commands for emergencies</span>
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-gray-800 justify-start border-slate-500"
            >
              <Users className="h-4 w-4 mr-3" />
              Community Forum
              <span className="ml-auto text-xs">Connect with others, share tips and locals</span>
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-gray-800 justify-start border-slate-500"
            >
              <MessageSquare className="h-4 w-4 mr-3" />
              Real-time Chat
              <span className="ml-auto text-xs">Chat with our safety advisors</span>
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-gray-800 justify-start border-slate-500"
            >
              <Star className="h-4 w-4 mr-3" />
              Guardian Gamification
              <span className="ml-auto text-xs">Earn points for safe travels</span>
            </Button>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-start">
              <Settings className="h-4 w-4 mr-3" />
              Settings
              <span className="ml-auto text-xs">Customize your safety preferences</span>
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-gray-800 justify-start border-slate-500"
            >
              <Share className="h-4 w-4 mr-3" />
              Share Feedback
              <span className="ml-auto text-xs">Help us improve the platform</span>
            </Button>
          </div>
        </div>

        {/* Admin Dashboard Section */}
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              {t("adminDashboard")}
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">BETA</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Incidents */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Active Incidents</h3>
              <div className="space-y-3">
                <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">HIGH</span>
                    <span className="text-slate-400 text-sm">2 min ago</span>
                  </div>
                  <p className="text-white font-medium">Tourist SOS</p>
                  <p className="text-slate-300 text-sm">📍 Tawang Monastery</p>
                  <p className="text-slate-400 text-xs">Tourist ID: #T-4567</p>
                  <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Dispatch
                  </Button>
                </div>

                <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">MEDIUM</span>
                    <span className="text-slate-400 text-sm">8 min ago</span>
                  </div>
                  <p className="text-white font-medium">Sarah Chen</p>
                  <p className="text-slate-300 text-sm">📍 Kaziranga National Park</p>
                  <p className="text-slate-400 text-xs">Tourist ID: #T-8901</p>
                  <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Dispatch
                  </Button>
                </div>
              </div>
            </div>

            {/* Live Map & Media */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Live Map & Media</h3>
              <div className="bg-slate-600 rounded-lg p-4 border border-slate-500 h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">Interactive Map</p>
                  <p className="text-slate-500 text-sm">Real-time incident tracking</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <p className="text-slate-400 text-sm">Active Incidents</p>
                <p className="text-slate-300 font-medium">Response Operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-yellow-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">GUARD</h3>
                <p className="text-sm text-slate-700">Emergency SOS & Smart Tourist Safety System</p>
              </div>
            </div>

            <nav className="flex space-x-6">
              <Link href="/" className="text-sm text-slate-700 hover:text-slate-900">
                {t("home")}
              </Link>
              <Link href="/features" className="text-sm text-slate-700 hover:text-slate-900">
                Features
              </Link>
              <Link href="/dashboard" className="text-sm text-slate-700 hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/about" className="text-sm text-slate-700 hover:text-slate-900">
                About
              </Link>
              <Link href="/contact" className="text-sm text-slate-700 hover:text-slate-900">
                Contact
              </Link>
            </nav>

            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">Team Rescue24, JEC Jabalpur</p>
              <p className="text-sm text-slate-700">Northeast India Safety Initiative</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
