import Link from "next/link"
import { Home, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/auth-card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Personal AI Coach</h1>
        </div>
        
        <AuthCard
          title="Seite nicht gefunden"
          description="Die gesuchte Seite existiert leider nicht oder wurde verschoben."
          icon={<AlertCircle className="h-6 w-6 text-orange-600" />}
        >
          <div className="space-y-4 text-center">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-6xl font-bold text-orange-200 mb-2">404</div>
              <p className="text-orange-800 font-medium">
                Oops! Diese Seite wurde nicht gefunden.
              </p>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.</p>
              <p>Kehren Sie zur Startseite zurück und versuchen Sie es erneut.</p>
            </div>

            <Link href="/">
              <Button className="w-full flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                Zur Startseite
              </Button>
            </Link>
          </div>
        </AuthCard>
      </div>
    </div>
  )
} 