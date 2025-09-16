"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { languages } from "@/lib/translations"

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { t } = useTranslation()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    password: "",
    confirmPassword: "",
    language: "en",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      emergencyContact: formData.emergencyContact,
      password: formData.password,
      language: formData.language,
    })

    if (success) {
      onSuccess?.()
    } else {
      setError("Registration failed. Please try again.")
    }
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("register")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder={t("fullName")}
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder={t("email")}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder={t("phone")}
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder={t("emergencyContact")}
            value={formData.emergencyContact}
            onChange={(e) => handleChange("emergencyContact", e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
          />
          <Select value={formData.language} onValueChange={(value) => handleChange("language", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("language")} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("loading") : t("registerNow")}
          </Button>
          {onSwitchToLogin && (
            <Button type="button" variant="ghost" className="w-full" onClick={onSwitchToLogin}>
              Already have an account? Sign In
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
