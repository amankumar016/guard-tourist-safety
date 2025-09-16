"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, MapPin, Clock, Users, Phone, CheckCircle, Eye, Navigation, Radio } from "lucide-react"
import Link from "next/link"

export default function PoliceDashboard() {
  const [activeEmergencies] = useState([
    {
      id: "PANIC-2025-001",
      user: "Amit Sharma",
      location: "Bhopal, MP",
      coordinates: "23.2599° N, 77.4126° E",
      time: "14:30:25",
      status: "Active",
      priority: "High",
      type: "Tourist Emergency",
      responders: ["PCR-101", "AMB-205"],
    },
    {
      id: "PANIC-2025-002",
      user: "Sarah Johnson",
      location: "New Market, Bhopal",
      coordinates: "23.2515° N, 77.4010° E",
      time: "14:25:10",
      status: "Responding",
      priority: "Medium",
      type: "Safety Concern",
      responders: ["PCR-102"],
    },
  ])

  const [recentIncidents] = useState([
    {
      id: "INC-2025-001",
      type: "Tourist Assistance",
      location: "Railway Station",
      time: "13:45:00",
      status: "Resolved",
      officer: "Constable Raj Kumar",
    },
    {
      id: "INC-2025-002",
      type: "Lost Tourist",
      location: "City Center",
      time: "12:30:15",
      status: "Resolved",
      officer: "Inspector Priya Singh",
    },
    {
      id: "INC-2025-003",
      type: "Medical Emergency",
      location: "Hotel District",
      time: "11:20:30",
      status: "Resolved",
      officer: "Constable Amit Verma",
    },
  ])

  const [availableUnits] = useState([
    { id: "PCR-101", type: "Patrol Car", status: "On Duty", location: "Sector 1", officer: "SI Rajesh Kumar" },
    { id: "PCR-102", type: "Patrol Car", status: "Responding", location: "New Market", officer: "Constable Mohan" },
    { id: "PCR-103", type: "Patrol Car", status: "Available", location: "Station", officer: "HC Suresh Yadav" },
    { id: "BIKE-201", type: "Patrol Bike", status: "Available", location: "City Center", officer: "Constable Ravi" },
    { id: "BIKE-202", type: "Patrol Bike", status: "On Duty", location: "Tourist Area", officer: "Constable Deepak" },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800"
      case "Responding":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Available":
        return "bg-green-100 text-green-800"
      case "On Duty":
        return "bg-blue-100 text-blue-800"
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
              <Link href="/track-panic">
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Track Panic Progress
                </Button>
              </Link>
              <Button variant="outline">Police Dashboard</Button>
              <Link href="/ai-guide">
                <Button className="bg-green-600 hover:bg-green-700">AI Guide</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Police Command Center</h1>
          <p className="text-gray-600">Emergency response coordination and incident management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Emergencies</p>
                  <p className="text-3xl font-bold text-red-600">2</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Units</p>
                  <p className="text-3xl font-bold text-green-600">3</p>
                </div>
                <Radio className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Incidents</p>
                  <p className="text-3xl font-bold text-blue-600">7</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Time</p>
                  <p className="text-3xl font-bold text-purple-600">4.2m</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="emergencies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emergencies">Active Emergencies</TabsTrigger>
            <TabsTrigger value="units">Units Status</TabsTrigger>
            <TabsTrigger value="incidents">Recent Incidents</TabsTrigger>
            <TabsTrigger value="map">Live Map</TabsTrigger>
          </TabsList>

          <TabsContent value="emergencies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Active Emergency Situations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeEmergencies.map((emergency) => (
                    <Card key={emergency.id} className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{emergency.id}</h3>
                            <p className="text-gray-600">
                              {emergency.user} - {emergency.type}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={getPriorityColor(emergency.priority)}>{emergency.priority}</Badge>
                            <Badge className={getStatusColor(emergency.status)}>{emergency.status}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{emergency.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{emergency.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{emergency.responders.join(", ")}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Navigation className="h-4 w-4 mr-1" />
                            Navigate
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Phone className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-700 border-green-300 hover:bg-green-50 bg-transparent"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Resolved
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Radio className="h-5 w-5" />
                  <span>Unit Status & Deployment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableUnits.map((unit) => (
                    <Card key={unit.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold">{unit.id}</h3>
                          <Badge className={getStatusColor(unit.status)}>{unit.status}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Type:</span> {unit.type}
                          </p>
                          <p>
                            <span className="font-medium">Location:</span> {unit.location}
                          </p>
                          <p>
                            <span className="font-medium">Officer:</span> {unit.officer}
                          </p>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Navigation className="h-4 w-4 mr-1" />
                            Track
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Phone className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Recent Incident Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium">{incident.id}</h3>
                            <p className="text-sm text-gray-600">{incident.type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{incident.location}</p>
                            <p className="text-sm text-gray-600">{incident.time}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{incident.officer}</p>
                            <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <Eye className="h-4 w-4 mr-1" />
                        View Report
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Live Situation Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
                    <p className="text-gray-600">Real-time visualization of emergencies, units, and incidents</p>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Load Map View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
