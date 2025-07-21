"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for error from URL params (e.g., redirected from NextAuth)
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) {
      toast.toast({
        title: "Login Failed",
        description: decodeURIComponent(errorParam),
        // variant: "destructive",
      });
    }
  }, [errorParam]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        // redirect: true,
        // callbackUrl: "/",
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      } else {
        router.push("/");
        console.log("Login successful!!!:", result);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
      setIsLoading(false);
    }
  };

  const loginAsRole = (role: string) => {
    switch (role) {
      case "admin":
        setEmail("admin@vtuadmin.com");
        setPassword("admin123");
        break;
      case "manager":
        setEmail("manager@vtuadmin.com");
        setPassword("manager123");
        break;
      case "support":
        setEmail("support@vtuadmin.com");
        setPassword("support123");
        break;
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Payonce Dashboard
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vtuadmin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-2">
              <Tabs defaultValue="admin">
                <div className="flex justify-center mb-2">
                  <p className="text-sm text-muted-foreground">
                    Test accounts:
                  </p>
                </div>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="admin"
                    onClick={() => loginAsRole("admin")}
                  >
                    Admin
                  </TabsTrigger>
                  <TabsTrigger
                    value="manager"
                    onClick={() => loginAsRole("manager")}
                  >
                    Manager
                  </TabsTrigger>
                  <TabsTrigger
                    value="support"
                    onClick={() => loginAsRole("support")}
                  >
                    Support
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="admin" className="mt-2">
                  <div className="text-xs text-muted-foreground">
                    <p>Email: admin@vtuadmin.com</p>
                    <p>Password: admin123</p>
                    <p className="mt-1">Full access to all features</p>
                  </div>
                </TabsContent>
                <TabsContent value="manager" className="mt-2">
                  <div className="text-xs text-muted-foreground">
                    <p>Email: manager@vtuadmin.com</p>
                    <p>Password: manager123</p>
                    <p className="mt-1">Limited access to settings</p>
                  </div>
                </TabsContent>
                <TabsContent value="support" className="mt-2">
                  <div className="text-xs text-muted-foreground">
                    <p>Email: support@vtuadmin.com</p>
                    <p>Password: support123</p>
                    <p className="mt-1">View-only access to most features</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
