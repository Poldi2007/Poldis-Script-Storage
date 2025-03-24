import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  title: string;
}

export function MobileHeader({ onOpenSidebar, title }: MobileHeaderProps) {
  return (
    <div className="flex items-center lg:hidden">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mr-4 text-gray-400 hover:text-white" 
        onClick={onOpenSidebar}
      >
        <Menu size={24} />
      </Button>
      <h1 className="text-xl font-bold text-accent">{title}</h1>
    </div>
  );
}
