"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, Shield } from "lucide-react"

export default function Component() {
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setVerificationCode(value)
  }

  const resendCode = async () => {
    setIsLoading(true)
    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          {step === "verify" && (
            <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={() => setStep("phone")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            {step === "phone" ? (
              <Phone className="h-6 w-6 text-blue-600" />
            ) : (
              <Shield className="h-6 w-6 text-blue-600" />
            )}
          </div>

          <CardTitle className="text-2xl font-bold">
            {step === "phone" ? "Sign up with phone" : "Verify your number"}
          </CardTitle>

          <CardDescription>
            {step === "phone" ? "Enter your phone number to get started" : `We sent a 6-digit code to ${phoneNumber}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="text-lg"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={phoneNumber.length < 14 || isLoading}>
                {isLoading ? "Sending code..." : "Send verification code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  className="text-lg text-center tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={verificationCode.length !== 6 || isLoading}>
                {isLoading ? "Verifying..." : "Verify and continue"}
              </Button>

              <div className="text-center">
                <Button type="button" variant="link" onClick={resendCode} disabled={isLoading} className="text-sm">
                  {"Didn't receive a code? Resend"}
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
