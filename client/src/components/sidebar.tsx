import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";

// We're keeping a simplified header component with just the Discord button
export function DiscordButton() {
  const openDiscord = () => {
    window.open('https://discord.gg/sETsEERsR4', '_blank');
  };

  return (
    <Button 
      className="bg-[#5865F2] hover:bg-blue-600 transition-colors duration-300 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2"
      onClick={openDiscord}
    >
      <SiDiscord size={18} />
      Join Our Discord
    </Button>
  );
}
