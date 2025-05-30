"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Phone, MessageCircle, AlertCircle, ExternalLink } from "lucide-react"
import { AuthCard } from "@/components/auth-card"
import { PhoneNumberInput } from "@/components/phone-number-input"
import Link from "next/link"

export function AlreadyRegistered() {
  const [step, setStep] = useState<"check" | "exists">("check")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [userData, setUserData] = useState<{
    name: string
    created_at: string
  } | null>(null)

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

  const handleCheckSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Convert formatted phone number to international format
      const cleanNumber = phoneNumber.replace(/\s/g, "")
      const internationalNumber = cleanNumber.startsWith('+') ? cleanNumber : `+49${cleanNumber.replace(/^0/, '')}`

      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: internationalNumber
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check user')
      }

      if (data.exists) {
        setUserData(data.user)
        setStep("exists")
      } else {
        setError("Diese Telefonnummer ist nicht registriert. Möchten Sie sich registrieren?")
      }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Personal AI Coach</h1>
        </div>
        
        {step === "check" ? (
          <AuthCard
            title="Telefonnummer überprüfen"
            description="Geben Sie Ihre Telefonnummer ein, um zu überprüfen, ob Sie bereits registriert sind"
            icon={<Phone className="h-6 w-6 text-blue-600" />}
          >
            <form onSubmit={handleCheckSubmit} className="space-y-4">
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
                  {error.includes("nicht registriert") && (
                    <div className="mt-2">
                      <Link href="/">
                        <Button size="sm" variant="outline">
                          Jetzt registrieren
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={phoneNumber.length < 14 || isLoading}
              >
                {isLoading ? "Überprüfe..." : "Telefonnummer überprüfen"}
              </Button>

              <div className="text-center">
                <Link href="/" className="text-sm text-blue-600 hover:underline">
                  ← Zurück zur Registrierung
                </Link>
              </div>
            </form>
          </AuthCard>
        ) : (
          <AuthCard
            title="Bereits registriert!"
            description="Diese Telefonnummer ist bereits bei uns registriert"
            icon={<AlertCircle className="h-6 w-6 text-orange-600" />}
          >
            <div className="space-y-4 text-center">
              <div className="bg-orange-50 p-4 rounded-lg">
                <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-orange-800 font-medium">
                  Willkommen zurück{userData?.name ? `, ${userData.name}` : ''}!
                </p>
                <p className="text-orange-600 text-sm mt-1">
                  Sie sind bereits seit dem {userData?.created_at && formatDate(userData.created_at)} registriert
                </p>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Was können Sie jetzt tun?</strong></p>
                <div className="space-y-1">
                  <p>📱 Öffnen Sie WhatsApp</p>
                  <p>💬 Schreiben Sie eine Nachricht an Ihren AI Coach</p>
                  <p>🚀 Setzen Sie Ihr Coaching fort!</p>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Tipp:</strong> Falls Sie keine Nachrichten mehr erhalten, stellen Sie sicher, dass Sie den AI Coach in WhatsApp nicht blockiert oder stumm geschaltet haben.
                </p>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.open('https://wa.me/', '_blank')}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp öffnen
                  <ExternalLink className="h-3 w-3" />
                </Button>

                <Button 
                  onClick={() => {
                    setStep("check")
                    setPhoneNumber("")
                    setError("")
                    setUserData(null)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Andere Nummer überprüfen
                </Button>

                <div className="text-center">
                  <Link href="/" className="text-sm text-blue-600 hover:underline">
                    ← Zurück zur Registrierung
                  </Link>
                </div>
              </div>
            </div>
          </AuthCard>
        )}
      </div>
    </div>
  )
} 