import React from "react";
import { User } from "../../types/user";
import { UserCircle } from "lucide-react";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium overflow-hidden`}
    >
      {user.avatarUrl ? (
        <img className="h-full w-full" src={user?.avatarUrl} alt="" />
      ) : (
        // <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <UserCircle className="text-black" />
        // </div>
      )}
    </div>
  );
}
