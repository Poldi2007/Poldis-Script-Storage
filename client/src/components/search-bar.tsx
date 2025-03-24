import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder="Search scripts..."
        className="w-full bg-secondary border border-gray-700 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-accent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
    </div>
  );
}
