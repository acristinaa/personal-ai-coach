"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Phone, Shield } from "lucide-react"
import { AuthCard } from "@/components/auth-card"
import { PhoneNumberInput } from "@/components/phone-number-input"
import { VerificationCodeInput } from "@/components/verification-code-input"


export default function PhoneSignup() {
  const [step, setStep] = useState<"phone" | "verify">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep("verify")
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    // Handle successful verification
    console.log("Verification successful!")
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setPhoneNumber(formatted)
  }

  const handleCodeChange = (value: string) => {
    const formatted = value.replace(/\D/g, "").slice(0, 6)
    setVerificationCode(formatted)
  }

  const resendCode = async () => {
    setIsLoading(true)
    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <AuthCard
        title={step === "phone" ? "mit Telefon anmelden" : "Prüfen Sie Ihre Nummer"}
        description={step === "phone" ? "Geben Sie Ihre Telefonnummer ein, um loszulegen" : `Wir haben einen 6-stelligen Code an ${phoneNumber}`}
        icon={step === "phone" ? <Phone className="h-6 w-6 text-blue-600" /> : <Shield className="h-6 w-6 text-blue-600" />}
        onBack={step === "verify" ? () => setStep("phone") : undefined}
      >
        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <PhoneNumberInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={phoneNumber.length < 14 || isLoading}>
              {isLoading ? "Code senden..." : "Verifizierungscode senden"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verifizierungscode</Label>
              <VerificationCodeInput
                value={verificationCode}
                onChange={handleCodeChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={verificationCode.length !== 6 || isLoading}>
              {isLoading ? "Verifizieren..." : "Verifizieren und fortfahren"}
            </Button>
            <div className="text-center">
              <Button type="button" variant="link" onClick={resendCode} disabled={isLoading} className="text-sm">
                {"Kein Code erhalten? Code erneut senden"}
              </Button>
            </div>
          </form>
        )}
        {/* <TermsAndPrivacy /> */}
      </AuthCard>
    </div>
  )
}
