import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface AuthCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onBack?: () => void;
  }
  
  export function AuthCard({
    title,
    description,
    icon,
    children,
    onBack
  }: AuthCardProps) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          {onBack && (
            <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    );
  }