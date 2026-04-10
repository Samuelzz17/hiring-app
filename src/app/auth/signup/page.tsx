"use client";

import { AuthForm } from "@/components/auth/auth-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <AuthForm type="signup" userType="candidate" />
      
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Looking for a job? Join our community today.
        </p>
      </div>
    </main>
  );
}
