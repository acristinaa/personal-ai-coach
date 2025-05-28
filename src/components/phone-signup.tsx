"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Phone, MessageCircle, CheckCircle } from "lucide-react"
import { AuthCard } from "@/components/auth-card"
import { PhoneNumberInput } from "@/components/phone-number-input"

export default function PhoneSignup() {
  const [step, setStep] = useState<"signup" | "success">("signup")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    if (digits.length >= 9) {
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
      } else if (digits.length >= 7) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
      } else if (digits.length >= 4) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else {
        return digits;
      }      
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Convert formatted phone number to international format
      const cleanNumber = phoneNumber.replace(/\s/g, "")
      const internationalNumber = cleanNumber.startsWith('+') ? cleanNumber : `+49${cleanNumber.replace(/^0/, '')}`

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: internationalNumber,
          name: name.trim() || undefined
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register')
      }

      setStep("success")
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setPhoneNumber(formatted)
    setError("") // Clear error when user types
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setError("") // Clear error when user types
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Willkommen bei Personal AI Coach</h1>
         {/* <p className="text-gray-600 mt-2">florezko</p> */}
        </div>
        
        {step === "signup" ? (
          <AuthCard
            title="Starten Sie mit Ihrem AI Coach"
            description="Geben Sie Ihre Daten ein und beginnen Sie sofort zu chatten"
            icon={<Phone className="h-6 w-6 text-blue-600" />}
          >
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (optional)</Label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Ihr Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefonnummer</Label>
                <PhoneNumberInput
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={phoneNumber.length < 14 || isLoading}
              >
                {isLoading ? "Registrierung..." : "Mit AI Coach starten"}
              </Button>
            </form>
          </AuthCard>
        ) : (
          <AuthCard
            title="Erfolgreich registriert!"
            description="Schauen Sie in WhatsApp nach Ihrer Willkommensnachricht und beginnen Sie zu chatten"
            icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          >
            <div className="space-y-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">
                  Willkommensnachricht gesendet!
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Öffnen Sie WhatsApp und beginnen Sie zu chatten
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>📱 Öffnen Sie WhatsApp</p>
                <p>💬 Suchen Sie nach der Nachricht von Ihrem AI Coach</p>
                <p>🚀 Beginnen Sie Ihre Coaching-Reise!</p>
              </div>

              <Button 
                onClick={() => {
                  setStep("signup")
                  setPhoneNumber("")
                  setName("")
                  setError("")
                }}
                variant="outline"
                className="w-full"
              >
                Neue Registrierung
              </Button>
            </div>
          </AuthCard>
        )}
      </div>
    </div>
  )
}
