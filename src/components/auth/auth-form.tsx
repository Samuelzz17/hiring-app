"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInAnonymously
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  type: "login" | "signup";
  userType: "candidate" | "admin";
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, userType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!auth || !db) throw new Error("Firebase not initialized");

      if (type === "signup") {
        if (userType === "admin") {
          throw new Error("Admin accounts must be created by an existing administrator.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email,
          displayName: name,
          role: "candidate",
          createdAt: new Date(),
        });

        toast({
          title: "Account created",
          description: "Welcome to JobFlow!",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Logged in",
          description: "Welcome back!",
        });
      }

      router.push(userType === "admin" ? "/dashboard" : "/jobs");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      if (!auth || !db) throw new Error("Firebase not initialized");
      
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: "guest@anonymous.com",
        displayName: "Guest User",
        role: "candidate",
        isAnonymous: true,
        createdAt: new Date(),
      }, { merge: true });

      toast({
        title: "Logged in as Guest",
        description: "Welcome to JobFlow!",
      });

      router.push("/jobs");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Guest Auth Error",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === "login" ? "Login" : "Sign Up"} as {userType === "admin" ? "Admin" : "Candidate"}</CardTitle>
        <CardDescription>
          {type === "login" 
            ? "Enter your credentials to access your account." 
            : "Create an account to start applying for jobs."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"}
          </Button>

          {userType === "candidate" && (
            <>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleGuestLogin} 
                disabled={loading}
              >
                Login as Guest
              </Button>
            </>
          )}

          {type === "login" && userType === "candidate" && (
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-normal" onClick={() => router.push("/auth/signup")}>
                Sign Up
              </Button>
            </p>
          )}
          {type === "signup" && (
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-normal" onClick={() => router.push("/auth/login")}>
                Login
              </Button>
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};
