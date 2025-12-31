"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button 
      className="bg-slate-900 text-white gap-2 hover:bg-slate-800"
      onClick={() => window.print()}
    >
      <Printer className="h-4 w-4" /> Imprimir / PDF
    </Button>
  );
}