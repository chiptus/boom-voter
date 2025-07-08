import { Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminActionsProps {
  canEdit: boolean;
  onAddArtist?: () => void;
  onAddGenre?: () => void;
  isMobile: boolean;
}

export const AdminActions = ({ canEdit, onAddArtist, onAddGenre, isMobile }: AdminActionsProps) => {
  if (!canEdit || (!onAddArtist && !onAddGenre)) {
    return null;
  }

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-800 border-purple-400/20 text-white">
          <DropdownMenuLabel className="text-purple-300">Admin Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-400/20" />
          
          {onAddArtist && (
            <DropdownMenuItem 
              onClick={onAddArtist}
              className="text-white hover:bg-purple-600 focus:bg-purple-600 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Artist
            </DropdownMenuItem>
          )}
          
          {onAddGenre && (
            <DropdownMenuItem 
              onClick={onAddGenre}
              className="text-white hover:bg-purple-600 focus:bg-purple-600 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Genre
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {onAddArtist && (
        <Button 
          onClick={onAddArtist} 
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Artist
        </Button>
      )}
      
      {onAddGenre && (
        <Button 
          onClick={onAddGenre} 
          variant="outline" 
          size="sm"
          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Genre
        </Button>
      )}
    </div>
  );
};