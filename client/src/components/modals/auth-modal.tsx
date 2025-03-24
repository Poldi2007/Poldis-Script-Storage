import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const loginSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});

export function AuthModal({ open }: { open: boolean }) {
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setError(null);
    
    try {
      await loginMutation.mutateAsync({
        username: "admin", // Hardcoded admin username
        password: data.password,
      });
      toast({
        title: "Success",
        description: "Admin-Zugriff gewährt!",
      });
      setLocation("/");
    } catch (error) {
      setError("Falsches Passwort. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-secondary border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-accent">Admin Login</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Geben Sie das Admin-Passwort ein, um Zugriff auf alle Funktionen zu erhalten.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      className="bg-background border-gray-700 focus:ring-accent"
                      placeholder="Admin-Passwort eingeben"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-red-500 text-center font-medium">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-accent transition-colors duration-300"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Anmeldung..." : "Als Admin anmelden"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
