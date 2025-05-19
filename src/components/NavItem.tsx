import { motion } from "framer-motion";
import { Home, Plus, List, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const navItems = [
  {
    name: "Dashboard",
    icon: Home,
    active: true,
    link: "",
  },
  {
    name: "Add Endpoint",
    icon: Plus,
    active: false,
    link: "add-endpoint",
  },
  {
    name: "Logs",
    icon: List,
    active: false,
    link: "logs",
  },
  {
    name: "Account",
    icon: User,
    active: false,
    link: "account",
  },
];

type NavItemType = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  active: boolean;
  link: string;
};

// Navigation Item component
export const NavItem = ({ item }: { item: NavItemType }) => {
  const navigate = useNavigate();

  const Icon = item.icon;
  return (
    <motion.div
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg cursor-pointer ${
        item.active
          ? "bg-[#00ffae]/10 text-[#00ffae]"
          : "text-gray-400 hover:bg-[#00ffae]/5 hover:text-gray-100"
      }`}
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => {
        navigate(item.link);
      }}
    >
      <Icon size={18} />
      <span>{item.name}</span>
    </motion.div>
  );
};
