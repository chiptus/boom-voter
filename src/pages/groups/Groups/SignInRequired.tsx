import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SignInRequired() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>Please sign in to manage groups</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/")} className="w-full">
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
