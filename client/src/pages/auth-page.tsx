import { useEffect, useState } from "react";
import { AuthModal } from "@/components/modals/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuth(true);
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen w-full bg-background text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold text-accent mb-2">Unity Script Library</h1>
        <p className="text-gray-400">Manage your C# Unity scripts in one place</p>
      </div>

      <AuthModal open={showAuth} />
    </div>
  );
}
