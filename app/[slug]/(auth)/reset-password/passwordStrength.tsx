"use client";

import { Check, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

export function PasswordStrength({ fieldName }: { fieldName: string }) {
  const { watch } = useFormContext();

  const password = watch(fieldName) || "";

  const checks = [
    { label: "Mínimo de 8 caracteres", pass: password.length >= 8 },
    { label: "Pelo menos uma letra maiúscula", pass: /[A-Z]/.test(password) },
    { label: "Pelo menos um número", pass: /[0-9]/.test(password) },
    { label: "Caractere especial (!@#$)", pass: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="rounded-md border bg-background p-4">
      <p>Sua senha deve conter:</p>
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        {checks.map((check, index) => (
          <div
            key={`${index}-${check.label}`}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors duration-200",
              check.pass
                ? "font-medium text-green-600"
                : "text-muted-foreground",
            )}
          >
            {check.pass ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
