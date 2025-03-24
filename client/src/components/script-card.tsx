import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { Script } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ScriptCardProps {
  script: Script;
  onView: (script: Script) => void;
  onDelete: (id: number) => void;
  isAuthenticated: boolean;
}

export function ScriptCard({ script, onView, onDelete, isAuthenticated }: ScriptCardProps) {
  // Extract first 200 characters or 10 lines of code for preview
  const codePreview = script.code.split('\n').slice(0, 10).join('\n');

  return (
    <Card className="bg-secondary overflow-hidden hover:ring-2 hover:ring-accent transition-shadow duration-300 group">
      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-white">{script.name}</h3>
        </div>
        
        <p className="text-gray-300 text-sm line-clamp-2 mb-4">{script.description}</p>
        
        <div className="h-24 overflow-hidden mb-4">
          <CodeBlock code={codePreview} maxHeight="24" />
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="link" 
            className="text-accent hover:text-white transition-colors duration-300 p-0"
            onClick={() => onView(script)}
          >
            View Details
          </Button>
          
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-500 hover:text-red-500 transition-colors duration-300",
                "opacity-0 group-hover:opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(script.id);
              }}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
