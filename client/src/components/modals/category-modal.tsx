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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string }) => void;
  isPending: boolean;
}

export function CategoryModal({ open, onClose, onSubmit, isPending }: CategoryModalProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when the modal is opened
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = (values: CategoryFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-secondary border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-accent">Add New Category</DialogTitle>
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
                  <FormLabel>Category Name</FormLabel>
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
                {isPending ? "Adding..." : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
