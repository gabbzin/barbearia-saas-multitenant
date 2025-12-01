import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/_components/ui/card";
import { LucideIcon } from "lucide-react";

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
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
