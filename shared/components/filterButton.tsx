"use client";

import { Button } from "./ui/button";

interface FilterButtonProps {
  label: string;
  onFilter: boolean;
  setOnFilter: (value: boolean) => void;
}

export function FilterButton({
  label,
  onFilter,
  setOnFilter,
}: FilterButtonProps) {
  return (
    <Button
      variant={onFilter ? "default" : "secondary"}
      onClick={() => setOnFilter(!onFilter)}
      className="text-xs"
    >
      {label}
    </Button>
  );
}
