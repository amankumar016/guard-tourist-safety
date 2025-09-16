"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, MapPin, Send, Bot, User, Mic, MicOff, Languages, HelpCircle } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function AIGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI Safety Guide. I can help you with tourist information, safety tips, emergency procedures, and local guidance. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const languages = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Chinese"]

  const quickQuestions = [
    "What are the emergency numbers in India?",
    "How do I stay safe while traveling?",
    "What should I do if I'm lost?",
    "Where can I find medical help?",
    "How do I contact the police?",
    "What are common tourist scams?",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("emergency") || input.includes("help") || input.includes("danger")) {
      return "🚨 If you're in immediate danger, press the PANIC button or call emergency services:\n\n• Police: 100\n• Fire: 101\n• Ambulance: 108\n• Tourist Helpline: 1363\n\nFor non-emergency assistance, I'm here to help guide you through any situation."
    }

    if (input.includes("lost") || input.includes("location")) {
      return "If you're lost, here's what you should do:\n\n1. Stay calm and don't panic\n2. Use your phone's GPS to share your location\n3. Look for landmarks or street signs\n4. Contact local authorities or tourist information centers\n5. Use the Saarthi feature in GUARD for location services\n\nWould you like me to help you with anything specific about your current location?"
    }

    if (input.includes("safe") || input.includes("safety")) {
      return "Here are essential safety tips for tourists:\n\n• Keep your digital ID accessible at all times\n• Share your location with trusted contacts\n• Stay in well-lit, populated areas\n• Trust your instincts about unsafe situations\n• Keep emergency numbers handy\n• Avoid displaying expensive items\n• Use official transportation services\n\nIs there a specific safety concern you'd like to discuss?"
    }

    if (input.includes("scam") || input.includes("fraud")) {
      return "Common tourist scams to watch out for:\n\n• Fake police checkpoints\n• Overcharging by vendors\n• Distraction theft\n• Fake travel agencies\n• ATM skimming\n• Gem/jewelry scams\n\nAlways verify credentials, use official services, and trust your instincts. If something feels wrong, it probably is."
    }

    if (input.includes("medical") || input.includes("hospital") || input.includes("doctor")) {
      return "For medical assistance:\n\n• Emergency: Call 108 for ambulance\n• Find nearest hospital using GUARD's location services\n• Keep your medical information and insurance details handy\n• For minor issues, look for registered pharmacies\n• Tourist areas usually have English-speaking medical staff\n\nDo you need help finding medical facilities in your area?"
    }

    // Default response
    return (
      "I understand you're asking about: " +
      userInput +
      "\n\nI'm here to help with safety guidance, emergency procedures, local information, and tourist assistance. Could you please provide more specific details about what you need help with?"
    )
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
    handleSendMessage()
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input functionality would be implemented here
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
              <Link href="/police">
                <Button variant="outline">Police Dashboard</Button>
              </Link>
              <Button className="bg-green-600 hover:bg-green-700">AI Guide</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-green-600" />
                  <span>AI Guide</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Language</p>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Multi-language support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>Quick Help</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start text-xs h-auto py-2 px-3 bg-transparent"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Police</span>
                    <Badge variant="outline">100</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Fire</span>
                    <Badge variant="outline">101</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Ambulance</span>
                    <Badge variant="outline">108</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Tourist Helpline</span>
                    <Badge variant="outline">1363</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-6 w-6 text-green-600" />
                    <span>AI Safety Guide</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 border"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === "ai" && <Bot className="h-4 w-4 mt-1 text-green-600" />}
                        {message.type === "user" && <User className="h-4 w-4 mt-1" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about safety, emergencies, or local information..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={toggleVoiceInput}
                    variant="outline"
                    size="icon"
                    className={`${isListening ? "bg-red-100 text-red-600" : "bg-transparent"}`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  AI Guide can help with safety tips, emergency procedures, and local information
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
