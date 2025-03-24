import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

const scriptSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  code: z.string().min(10, { message: "Code must be at least 10 characters" }),
});

type ScriptFormValues = z.infer<typeof scriptSchema>;

interface ScriptModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { 
    name: string; 
    description: string; 
    code: string;
  }) => void;
  isPending: boolean;
}

export function ScriptModal({ open, onClose, onSubmit, isPending }: ScriptModalProps) {
  const form = useForm<ScriptFormValues>({
    resolver: zodResolver(scriptSchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
    },
  });

  // Reset form when the modal is opened
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = (values: ScriptFormValues) => {
    onSubmit({
      name: values.name,
      description: values.description,
      code: values.code,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-secondary border-gray-800 text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-accent">Add New Script</DialogTitle>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={onClose}>
              <X />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Script Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-background border-gray-700 focus:ring-accent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-background border-gray-700 focus:ring-accent resize-none h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>C# Code</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-background border-gray-700 focus:ring-accent font-mono h-64"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-accent transition-colors duration-300"
                disabled={isPending}
              >
                {isPending ? "Adding..." : "Add Script"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
