import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  username?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg";
}

export const UserAvatar = ({
  username,
  email,
  size = "md",
}: UserAvatarProps) => {
  const getInitials = () => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src="" alt={username || email || "User"} />
      <AvatarFallback className="bg-purple-600 text-white font-medium">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};
