import { Logo } from "./Logo";
import { NavItem, navItems } from "./NavItem";
import { LogOut } from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
export const Sidebar = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <div className="hidden md:flex flex-col h-screen w-60 bg-[#0e0e10] border-r border-gray-800 fixed left-0 top-0">
      <div className="p-4">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto pt-6">
        <nav className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-800 flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-white">{user?.fullName}</p>
            <p className="text-xs text-gray-400">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <div className="cursor-pointer">
          <LogOut color="#b23b3b" onClick={() => signOut()} />
        </div>
      </div>
    </div>
  );
};
