"use client";

import { useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("role") === "admin";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <AuthForm type="login" userType={isAdmin ? "admin" : "candidate"} />
      
      {!isAdmin && (
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Are you an administrator?{" "}
            <Link href="/auth/login?role=admin" className="text-blue-600 hover:underline">
              Admin Login
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}
