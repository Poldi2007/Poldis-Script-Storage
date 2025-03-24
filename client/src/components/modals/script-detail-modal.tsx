import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Script } from "@shared/schema";
import { Copy, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScriptDetailModalProps {
  script: Script | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  isAuthenticated: boolean;
}

export function ScriptDetailModal({ 
  script, 
  open, 
  onClose, 
  onDelete,
  isAuthenticated
}: ScriptDetailModalProps) {
  const { toast } = useToast();

  if (!script) return null;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(script.code).then(
      () => {
        toast({
          title: "Copied!",
          description: "Code copied to clipboard",
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Could not copy code to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-secondary border-gray-800 text-white sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-accent">{script.name}</DialogTitle>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={onClose}>
              <X />
            </Button>
          </div>
        </DialogHeader>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-300">{script.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">C# Script</h3>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-1 px-3 rounded-md flex items-center gap-2"
              onClick={copyScriptToClipboard}
            >
              <Copy size={14} />
              Copy
            </Button>
          </div>
          <CodeBlock code={script.code} />
        </div>

        {isAuthenticated && (
          <DialogFooter>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => onDelete(script.id)}
            >
              <Trash2 size={16} />
              Delete Script
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
