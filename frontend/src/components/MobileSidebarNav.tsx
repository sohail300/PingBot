import { LogOut, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Logo } from "./Logo";
import { NavItem, navItems } from "./NavItem";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const MobileSidebarNav = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-[#0e0e10] border-b border-gray-800">
      <Logo />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-[#0e0e10] border-r border-gray-800"
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <Logo />
            </div>
            <div className="flex-1 overflow-y-auto py-4">
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
        </SheetContent>
      </Sheet>
    </div>
  );
};
