import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type CardInfoProps = {
  Icon?: LucideIcon;
  title: string;
  value: React.ReactNode;
  variant?: "default" | "green" | "blue" | "yellow" | "red" | null;
};

export default function CardInfo({
  Icon,
  title,
  value,
  variant,
}: CardInfoProps) {
  return (
    <Card variant={variant} className="relative">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 font-bold">
          {title}
          {Icon && <Icon className="h-5 w-5 opacity-50" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-bold text-2xl">{value}</p>
      </CardContent>
    </Card>
  );
}
