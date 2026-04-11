import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Briefcase, Users, UserCheck } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  colorClass?: string;
}

export function StatCard({ title, value, description, icon: Icon, colorClass }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${colorClass || "bg-primary/10"}`}>
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export function StatsGrid({ 
  totalJobs, 
  activeApplications, 
  totalEmployees 
}: { 
  totalJobs: number; 
  activeApplications: number; 
  totalEmployees: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard 
        title="Total Jobs" 
        value={totalJobs} 
        description="Active job postings" 
        icon={Briefcase} 
        colorClass="bg-blue-100 text-blue-700"
      />
      <StatCard 
        title="Active Applications" 
        value={activeApplications} 
        description="Candidates in funnel" 
        icon={Users} 
        colorClass="bg-green-100 text-green-700"
      />
      <StatCard 
        title="Total Employees" 
        value={totalEmployees} 
        description="Successful hires" 
        icon={UserCheck} 
        colorClass="bg-purple-100 text-purple-700"
      />
    </div>
  );
}
