import { useState, useMemo } from "react";
import { SearchBar } from "@/components/search-bar";
import { ScriptCard } from "@/components/script-card";
import { ScriptDetailModal } from "@/components/modals/script-detail-modal";
import { ScriptModal } from "@/components/modals/script-modal";
import { DiscordButton } from "@/components/sidebar"; // Renamed for simplicity but still importing Discord button
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ShieldCheck, LogOut } from "lucide-react";
import { useScripts } from "@/hooks/use-scripts";
import { useAuth } from "@/hooks/use-auth";
import { Script } from "@shared/schema";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { 
    scripts, 
    isLoadingScripts, 
    addScript, 
    deleteScript, 
    isAddingScript 
  } = useScripts();

  const [searchQuery, setSearchQuery] = useState("");
  const [scriptModalOpen, setScriptModalOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [scriptDetailOpen, setScriptDetailOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<number | null>(null);

  // Filter scripts by search query
  const filteredScripts = useMemo(() => {
    return scripts.filter(script => {
      return searchQuery === "" || 
        script.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.code.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [scripts, searchQuery]);

  const handleViewScript = (script: Script) => {
    setSelectedScript(script);
    setScriptDetailOpen(true);
  };

  const handleDeleteScript = (id: number) => {
    setScriptToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (scriptToDelete !== null) {
      deleteScript(scriptToDelete);
      if (selectedScript?.id === scriptToDelete) {
        setScriptDetailOpen(false);
      }
      setDeleteConfirmOpen(false);
      setScriptToDelete(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background text-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-secondary border-b border-gray-800">
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-accent">Unity Script Library</h1>
            
            <div className="hidden md:block w-1/2">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <DiscordButton />
              </div>
              
              {!user ? (
                <Button 
                  variant="outline"
                  className="border-primary text-accent hover:bg-primary hover:bg-opacity-20 transition-colors duration-300 flex items-center gap-2"
                  onClick={() => setLocation("/auth")}
                >
                  <ShieldCheck size={16} />
                  <span className="hidden sm:inline">Admin Area</span>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    className="bg-primary hover:bg-accent transition-colors duration-300 flex items-center gap-2"
                    onClick={() => setScriptModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Script</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-20 transition-colors duration-300 flex items-center gap-2"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="px-4 pb-4 block md:hidden">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
            />
          </div>
          
          {/* Mobile Discord button */}
          <div className="px-4 pb-4 flex sm:hidden justify-center">
            <DiscordButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6">All Scripts</h2>
          
          {isLoadingScripts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : filteredScripts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-secondary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No scripts found</h3>
              <p className="text-gray-400 max-w-md">
                {searchQuery 
                  ? "Try adjusting your search query."
                  : "No scripts available. Add a new script to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScripts.map((script) => (
                <ScriptCard 
                  key={script.id} 
                  script={script} 
                  onView={handleViewScript}
                  onDelete={handleDeleteScript}
                  isAuthenticated={!!user}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ScriptModal
        open={scriptModalOpen}
        onClose={() => setScriptModalOpen(false)}
        onSubmit={addScript}
        isPending={isAddingScript}
      />

      <ScriptDetailModal
        script={selectedScript}
        open={scriptDetailOpen}
        onClose={() => setScriptDetailOpen(false)}
        onDelete={handleDeleteScript}
        isAuthenticated={!!user}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-secondary border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This script will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
