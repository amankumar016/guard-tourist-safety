"use client"

import { useEffect, useState } from "react"
import { MapPin, Shield, AlertTriangle, AlertCircle } from "lucide-react"

interface SafetyZone {
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
}

interface NortheastMapProps {
  selectedZone?: string
  onZoneSelect?: (zone: SafetyZone) => void
}

export default function NortheastMap({ selectedZone, onZoneSelect }: NortheastMapProps) {
  const [zones, setZones] = useState<SafetyZone[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  useEffect(() => {
    fetchSafetyZones()
  }, [])

  const fetchSafetyZones = async () => {
    try {
      const response = await fetch("/api/safety-zones")
      const data = await response.json()
      setZones(data.zones || [])
    } catch (error) {
      console.error("Error fetching safety zones:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "safe":
        return "#10B981" // Green
      case "moderate":
        return "#F59E0B" // Yellow
      case "high":
        return "#EF4444" // Red
      default:
        return "#6B7280" // Gray
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "safe":
        return <Shield className="h-4 w-4" />
      case "moderate":
        return <AlertTriangle className="h-4 w-4" />
      case "high":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading Northeast India Map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-slate-800 rounded-lg overflow-hidden">
      {/* Map Header */}
      <div className="bg-slate-700 p-4 border-b border-slate-600">
        <h3 className="text-xl font-semibold text-white mb-2">Northeast India Safety Map</h3>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-300">Safe Zone</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-300">Moderate Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-300">High Risk</span>
          </div>
        </div>
      </div>

      {/* SVG Map */}
      <div className="relative h-96 bg-slate-900">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
        >
          {/* Northeast India outline */}
          <path
            d="M200 150 L600 150 L650 200 L650 450 L200 450 Z"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* State boundaries */}
          <g stroke="#4B5563" strokeWidth="1" fill="none">
            <path d="M200 150 L400 150 L400 300 L200 300 Z" /> {/* Assam */}
            <path d="M400 150 L600 150 L600 250 L400 250 Z" /> {/* Arunachal Pradesh */}
            <path d="M200 300 L350 300 L350 450 L200 450 Z" /> {/* Meghalaya */}
            <path d="M350 300 L500 300 L500 400 L350 400 Z" /> {/* Manipur */}
            <path d="M500 300 L650 300 L650 450 L500 450 Z" /> {/* Nagaland */}
            <path d="M400 250 L600 250 L600 300 L400 300 Z" /> {/* Mizoram */}
            <path d="M350 400 L500 400 L500 450 L350 450 Z" /> {/* Tripura */}
          </g>

          {/* Safety Zones */}
          {zones.map((zone, index) => {
            const centerLat = zone.coordinates.reduce((sum, coord) => sum + coord.latitude, 0) / zone.coordinates.length
            const centerLng =
              zone.coordinates.reduce((sum, coord) => sum + coord.longitude, 0) / zone.coordinates.length

            // Convert lat/lng to SVG coordinates (simplified projection)
            const x = (centerLng - 90) * 15 + 300
            const y = (28 - centerLat) * 20 + 100

            const isSelected = selectedZone === zone.name
            const isHovered = hoveredZone === zone.name

            return (
              <g key={index}>
                {/* Zone area */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected || isHovered ? 25 : 20}
                  fill={getRiskColor(zone.riskLevel)}
                  fillOpacity={0.3}
                  stroke={getRiskColor(zone.riskLevel)}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredZone(zone.name)}
                  onMouseLeave={() => setHoveredZone(null)}
                  onClick={() => onZoneSelect?.(zone)}
                />

                {/* Zone marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill={getRiskColor(zone.riskLevel)}
                  className="cursor-pointer"
                  onClick={() => onZoneSelect?.(zone)}
                />

                {/* Zone label */}
                <text
                  x={x}
                  y={y + 35}
                  textAnchor="middle"
                  className="fill-white text-xs font-medium pointer-events-none"
                  style={{ fontSize: "12px" }}
                >
                  {zone.name.split(" ")[0]}
                </text>
              </g>
            )
          })}

          {/* Major cities */}
          <g className="fill-blue-400">
            <circle cx="300" cy="200" r="3" />
            <text x="305" y="205" className="text-xs fill-blue-300">
              Guwahati
            </text>

            <circle cx="250" cy="320" r="3" />
            <text x="255" y="325" className="text-xs fill-blue-300">
              Shillong
            </text>

            <circle cx="550" cy="180" r="3" />
            <text x="555" y="185" className="text-xs fill-blue-300">
              Tawang
            </text>

            <circle cx="450" cy="350" r="3" />
            <text x="455" y="355" className="text-xs fill-blue-300">
              Imphal
            </text>
          </g>
        </svg>

        {/* Hover tooltip */}
        {hoveredZone && (
          <div className="absolute top-4 right-4 bg-slate-700 p-3 rounded-lg border border-slate-600 max-w-xs">
            <h4 className="font-semibold text-white mb-1">{hoveredZone}</h4>
            <p className="text-sm text-slate-300">{zones.find((z) => z.name === hoveredZone)?.description}</p>
          </div>
        )}
      </div>

      {/* Zone Details Panel */}
      {selectedZone && (
        <div className="bg-slate-700 p-4 border-t border-slate-600">
          {zones
            .filter((zone) => zone.name === selectedZone)
            .map((zone, index) => (
              <div key={index}>
                <div className="flex items-center space-x-2 mb-2">
                  <div style={{ color: getRiskColor(zone.riskLevel) }}>{getRiskIcon(zone.riskLevel)}</div>
                  <h4 className="font-semibold text-white">{zone.name}</h4>
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: getRiskColor(zone.riskLevel) + "20",
                      color: getRiskColor(zone.riskLevel),
                    }}
                  >
                    {zone.riskLevel.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3">{zone.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-white mb-2">Available Facilities</h5>
                    <ul className="text-sm text-slate-300 space-y-1">
                      {zone.facilities.map((facility, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>{facility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-white mb-2">Emergency Services</h5>
                    <div className="text-sm text-slate-300 space-y-1">
                      <div>
                        Police: <span className="text-green-400">{zone.emergencyServices.police}</span>
                      </div>
                      <div>
                        Medical: <span className="text-blue-400">{zone.emergencyServices.medical}</span>
                      </div>
                      <div>
                        Fire: <span className="text-red-400">{zone.emergencyServices.fire}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
