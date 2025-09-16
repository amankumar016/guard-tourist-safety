"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, MapPin, Brain, Eye, Zap, Database, Users, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import LanguageSelector from "@/components/language-selector"
import NortheastMap from "@/components/northeast-map"

export default function SaarthiPage() {
  const { t } = useTranslation()
  const [selectedLocation, setSelectedLocation] = useState("Guwahati")
  const [selectedZone, setSelectedZone] = useState<any>(null)

  const northeastLocations = [
    { name: "Guwahati", state: "Assam", risk: "safe", lat: 26.1445, lng: 91.7362 },
    { name: "Shillong", state: "Meghalaya", risk: "safe", lat: 25.5788, lng: 91.8933 },
    { name: "Imphal", state: "Manipur", risk: "moderate", lat: 24.817, lng: 93.9368 },
    { name: "Aizawl", state: "Mizoram", risk: "safe", lat: 23.1645, lng: 92.9376 },
    { name: "Kohima", state: "Nagaland", risk: "moderate", lat: 25.6751, lng: 94.1086 },
    { name: "Itanagar", state: "Arunachal Pradesh", risk: "high", lat: 27.0844, lng: 93.6053 },
    { name: "Agartala", state: "Tripura", risk: "safe", lat: 23.8315, lng: 91.2868 },
    { name: "Gangtok", state: "Sikkim", risk: "safe", lat: 27.3389, lng: 88.6065 },
    { name: "Tezpur", state: "Assam", risk: "moderate", lat: 26.6333, lng: 92.8 },
    { name: "Dibrugarh", state: "Assam", risk: "safe", lat: 27.4728, lng: 94.912 },
  ]

  const saarthiSuperpowers = [
    {
      title: "Behavior Mirror Engine",
      description: "Learns from your travel patterns and preferences to provide personalized safety recommendations",
      icon: Eye,
      color: "bg-blue-500",
    },
    {
      title: "Future Risk Simulation",
      description: "Predicts potential safety risks based on historical data and current conditions",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Emotion Sync Mode",
      description: "Adapts to your emotional state and stress levels to provide appropriate support",
      icon: Activity,
      color: "bg-red-500",
    },
    {
      title: "Parallel World Safety View",
      description: "Shows alternative routes and scenarios to help you make safer travel decisions",
      icon: Zap,
      color: "bg-yellow-500",
    },
    {
      title: "Learning Memory Bank",
      description: "Continuously learns from tourist experiences to improve safety recommendations",
      icon: Brain,
      color: "bg-green-500",
    },
  ]

  const memoryLog = [
    { type: "Safe Experience", location: "Kaziranga National Park", time: "2 hours ago", risk: "safe" },
    { type: "Risk Encountered", location: "Remote area near Tawang", time: "1 day ago", risk: "high" },
    { type: "Safe Experience", location: "Majuli Island", time: "3 days ago", risk: "safe" },
    { type: "Weather Alert", location: "Cherrapunji", time: "5 days ago", risk: "moderate" },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe":
        return "bg-green-100 text-green-800 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskDotColor = (risk: string) => {
    switch (risk) {
      case "safe":
        return "#22c55e"
      case "moderate":
        return "#eab308"
      case "high":
        return "#ef4444"
      default:
        return "#6b7280"
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
                <Button variant="outline">{t("tourist")}</Button>
              </Link>
              <Link href="/panic">
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  {t("panic").toUpperCase()}
                </Button>
              </Link>
              <Button variant="outline" className="flex items-center space-x-1 bg-blue-100 border-blue-300">
                <MapPin className="h-4 w-4" />
                <span>{t("saarthi")}</span>
              </Button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet {t("saarthi")}</h1>
          <p className="text-gray-600 mb-8">
            Your personal safety AI twin, analyzing millions of data points to predict and prevent risks in real-time
          </p>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg">Hi</Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-6 w-6" />
              <span>How {t("saarthi")} Learns</span>
            </CardTitle>
            <p className="text-gray-600">
              A live network of data sources powers {t("saarthi")}'s intelligence, analyzing millions of data points to
              learn more
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                { icon: Users, label: "Tourist Data" },
                { icon: MapPin, label: "Location" },
                { icon: Activity, label: "Behavior" },
                { icon: TrendingUp, label: "Trends" },
                { icon: Eye, label: "Surveillance" },
                { icon: Database, label: "Historical" },
                { icon: Zap, label: "Real-time" },
                { icon: Brain, label: "AI Analysis" },
              ].map((item, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <item.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("saarthi")}'s Superpowers</CardTitle>
            <p className="text-gray-600">Next-level AI capabilities</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saarthiSuperpowers.map((power, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`${power.color} p-3 rounded-full`}>
                    <power.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{power.title}</h3>
                    <p className="text-sm text-gray-600">{power.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">12</div>
                <div className="text-sm text-gray-600">Current Risk Level</div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold mb-2">12/100</div>
                <div className="text-sm text-gray-600 mb-4">Exceptionally low risk score</div>
                <Progress value={12} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My {t("saarthi")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                GS
              </div>
              <div>
                <h3 className="font-bold">Guest {t("saarthi")}</h3>
                <p className="text-sm text-gray-600">Last updated: 2 min ago</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">Safe</div>
                <Progress value={85} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">Safety Status</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">Active</div>
                <Progress value={92} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">Monitoring</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">1,254</div>
                <p className="text-sm text-gray-600">Data Points Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("saarthi")}'s Memory Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memoryLog.map((log, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getRiskDotColor(log.risk) }} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{log.type}</span>
                      <Badge className={getRiskColor(log.risk)}>{log.risk}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{log.location}</p>
                  </div>
                  <div className="text-sm text-gray-500">{log.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Northeast India Safety Map</CardTitle>
            <p className="text-gray-600">Interactive risk zone mapping powered by real-time data</p>
          </CardHeader>
          <CardContent>
            <NortheastMap selectedZone={selectedZone?.name} onZoneSelect={setSelectedZone} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
