import { useQuery, useMutation } from "@tanstack/react-query";
import { Script } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useScripts() {
  const { toast } = useToast();

  const { 
    data: scripts = [], 
    isLoading: isLoadingScripts,
    error: scriptsError
  } = useQuery<Script[], Error>({
    queryKey: ["/api/scripts"],
  });

  const addScriptMutation = useMutation({
    mutationFn: async (data: { 
      name: string; 
      description: string; 
      code: string;
    }) => {
      const res = await apiRequest("POST", "/api/scripts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
      toast({
        title: "Success",
        description: "Script added successfully",
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

  const deleteScriptMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/scripts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
      toast({
        title: "Success",
        description: "Script deleted successfully",
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
    scripts,
    isLoadingScripts,
    scriptsError,
    addScript: (data: { 
      name: string; 
      description: string; 
      code: string;
    }) => addScriptMutation.mutate(data),
    deleteScript: (id: number) => deleteScriptMutation.mutate(id),
    isAddingScript: addScriptMutation.isPending,
    isDeletingScript: deleteScriptMutation.isPending,
  };
}
