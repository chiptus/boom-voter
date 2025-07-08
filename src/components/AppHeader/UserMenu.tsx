import { User } from "@supabase/supabase-js";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";

interface UserMenuProps {
  user: User;
  profile?: any;
  onSignOut: () => void;
  isMobile?: boolean;
}

export const UserMenu = ({ user, profile, onSignOut, isMobile }: UserMenuProps) => {
  const displayName = profile?.username || user.email?.split('@')[0] || 'User';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-2 rounded-full hover:bg-purple-600/10 transition-colors"
        >
          <UserAvatar 
            username={profile?.username} 
            email={user.email} 
            size={isMobile ? "sm" : "md"} 
          />
          {!isMobile && (
            <span className="text-white font-medium">
              {displayName}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-gray-800 border-purple-400/20 text-white"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {displayName}
            </p>
            <p className="text-xs leading-none text-purple-300">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-purple-400/20" />
        
        <DropdownMenuItem 
          className="text-white hover:bg-purple-600 focus:bg-purple-600 cursor-pointer"
          disabled
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-white hover:bg-purple-600 focus:bg-purple-600 cursor-pointer"
          disabled
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-purple-400/20" />
        
        <DropdownMenuItem 
          onClick={onSignOut}
          className="text-red-400 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};