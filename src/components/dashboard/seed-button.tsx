"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { seedDatabase } from "@/lib/seed";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function SeedButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to seed the database? This will add sample jobs and candidates.")) {
      return;
    }

    setLoading(true);
    try {
      await seedDatabase();
      toast({
        title: "Database Seeded",
        description: "Sample data has been added successfully.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Seeding Failed",
        description: error.message || "An error occurred during seeding.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSeed} 
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      Seed System Data
    </Button>
  );
}
