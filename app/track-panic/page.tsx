"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Shield, Search, MapPin, Clock, AlertTriangle, CheckCircle, Users, Phone } from "lucide-react"
import Link from "next/link"

export default function TrackPanicPage() {
  const [searchId, setSearchId] = useState("")
  const [trackingData, setTrackingData] = useState(null)

  const mockTrackingData = {
    id: "PANIC-2025-001",
    status: "Active",
    timestamp: "2025-01-17 14:30:25",
    location: "Bhopal, Madhya Pradesh",
    coordinates: "23.2599° N, 77.4126° E",
    user: {
      name: "Amit Sharma",
      phone: "+91 98765 43210",
      digitalId: "DID-2025-AS-001",
    },
    timeline: [
      { time: "14:30:25", event: "Panic button activated", status: "completed" },
      { time: "14:30:27", event: "Location shared with authorities", status: "completed" },
      { time: "14:30:30", event: "Emergency services notified", status: "completed" },
      { time: "14:30:35", event: "Emergency contacts alerted", status: "completed" },
      { time: "14:32:10", event: "Police unit dispatched", status: "completed" },
      { time: "14:35:00", event: "Ambulance dispatched", status: "in-progress" },
      { time: "ETA 14:40", event: "First responder arrival", status: "pending" },
    ],
    responders: [
      { type: "Police", unit: "PCR-101", eta: "5 mins", status: "En route" },
      { type: "Ambulance", unit: "AMB-205", eta: "8 mins", status: "Dispatched" },
      { type: "Fire Service", unit: "FS-301", eta: "12 mins", status: "Standby" },
    ],
    contacts: [
      { name: "Priya Sharma (Wife)", phone: "+91 98765 43211", notified: true },
      { name: "Rajesh Kumar (Brother)", phone: "+91 98765 43212", notified: true },
      { name: "Office Emergency", phone: "+91 98765 43213", notified: false },
    ],
  }

  const handleSearch = () => {
    if (searchId.trim()) {
      // Simulate API call
      setTimeout(() => {
        setTrackingData(mockTrackingData)
      }, 1000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                <Button variant="outline">Tourist View</Button>
              </Link>
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
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                Track Panic Progress
              </Button>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Panic Progress</h1>
          <p className="text-gray-600">Monitor emergency response status and progress in real-time</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Emergency</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Enter Panic ID (e.g., PANIC-2025-001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Track
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Demo ID: PANIC-2025-001 (Use this to see sample tracking data)</p>
          </CardContent>
        </Card>

        {trackingData && (
          <div className="space-y-6">
            {/* Emergency Overview */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <span className="text-red-800">Emergency #{trackingData.id}</span>
                  </div>
                  <Badge className="bg-red-600 text-white">{trackingData.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-red-700 font-medium">Started</p>
                    <p className="text-red-800">{trackingData.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-red-700 font-medium">Location</p>
                    <p className="text-red-800">{trackingData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-red-700 font-medium">User</p>
                    <p className="text-red-800">{trackingData.user.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Response Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.timeline.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            item.status === "completed"
                              ? "bg-green-600"
                              : item.status === "in-progress"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                          }`}
                        >
                          {item.status === "completed" ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <Clock className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{item.event}</p>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Responders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Emergency Responders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.responders.map((responder, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{responder.type}</h3>
                          <Badge variant="outline">{responder.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Unit: {responder.unit}</p>
                        <p className="text-sm text-gray-600">ETA: {responder.eta}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Location Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Address</p>
                      <p className="text-gray-900">{trackingData.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Coordinates</p>
                      <p className="text-gray-900">{trackingData.coordinates}</p>
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Emergency Contacts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trackingData.contacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                        </div>
                        <Badge
                          className={contact.notified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {contact.notified ? "Notified" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!trackingData && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Selected</h3>
              <p className="text-gray-600">Enter a Panic ID above to track emergency response progress</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
