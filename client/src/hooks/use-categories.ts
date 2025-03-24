import { useQuery, useMutation } from "@tanstack/react-query";
import { Category, insertCategorySchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useCategories() {
  const { toast } = useToast();

  const { 
    data: categories = [], 
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery<Category[], Error>({
    queryKey: ["/api/categories"],
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await apiRequest("POST", "/api/categories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    categories,
    isLoadingCategories,
    categoriesError,
    addCategory: (data: { name: string }) => addCategoryMutation.mutate(data),
    deleteCategory: (id: number) => deleteCategoryMutation.mutate(id),
    isAddingCategory: addCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
  };
}
