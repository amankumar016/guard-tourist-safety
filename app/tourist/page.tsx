"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, MapPin, MessageCircle, Users, AlertTriangle, Phone, Navigation, Clock } from "lucide-react"
import Link from "next/link"

export default function TouristViewPage() {
  const [emergencyContacts] = useState([
    { name: "Police", number: "100", type: "emergency" },
    { name: "Fire", number: "101", type: "emergency" },
    { name: "Ambulance", number: "108", type: "emergency" },
    { name: "Tourist Helpline", number: "1363", type: "helpline" },
  ])

  const [safetyTips] = useState([
    "Always keep your digital ID accessible",
    "Share your location with trusted contacts",
    "Stay in well-lit, populated areas",
    "Keep emergency numbers handy",
    "Trust your instincts about unsafe situations",
  ])

  const [nearbyServices] = useState([
    { name: "City Hospital", distance: "0.5 km", type: "hospital" },
    { name: "Police Station", distance: "0.8 km", type: "police" },
    { name: "Tourist Information Center", distance: "1.2 km", type: "info" },
    { name: "Embassy", distance: "2.1 km", type: "embassy" },
  ])

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
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                Tourist View
              </Button>
              <Link href="/panic">
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  PANIC
                </Button>
              </Link>
              <Link href="/saarthi">
                <Button variant="outline" className="flex items-center space-x-1 bg-transparent">
                  <MapPin className="h-4 w-4" />
                  <span>Saarthi</span>
                </Button>
              </Link>
              <Link href="/track-panic">
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Track Panic Progress
                </Button>
              </Link>
              <Link href="/police">
                <Button variant="outline">Police Dashboard</Button>
              </Link>
              <Link href="/ai-guide">
                <Button className="bg-green-600 hover:bg-green-700">AI Guide</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tourist Safety Dashboard</h1>
          <p className="text-gray-600">Your comprehensive safety companion while traveling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Emergency Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Emergency Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/panic">
                    <Button variant="destructive" className="w-full h-16 text-lg bg-red-600 hover:bg-red-700">
                      <AlertTriangle className="h-6 w-6 mr-2" />
                      PANIC ALERT
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-16 text-lg border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                  >
                    <Phone className="h-6 w-6 mr-2" />
                    Call Emergency
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-16 text-lg border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                  >
                    <Navigation className="h-6 w-6 mr-2" />
                    Share Location
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-16 text-lg border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    <MessageCircle className="h-6 w-6 mr-2" />
                    Quick Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Features */}
            <Card>
              <CardHeader>
                <CardTitle>Safety Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Digital ID</h3>
                        <p className="text-sm text-gray-600">QR-based identification</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Geofencing</h3>
                        <p className="text-sm text-gray-600">Safe zone alerts</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Real-time Tracking</h3>
                        <p className="text-sm text-gray-600">Privacy-first monitoring</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Community Support</h3>
                        <p className="text-sm text-gray-600">Connect with locals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Safety Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {safetyTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.number}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Nearby Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nearby Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.distance}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {service.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Safety Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Location Sharing</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emergency Contacts</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Digital ID</span>
                    <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
