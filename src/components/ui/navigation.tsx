import { Building, Users, Settings, Shield, BarChart3, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "integradores", label: "Integradores", icon: Building },
  { id: "grupos-acesso", label: "Grupos de Acesso", icon: UserCheck },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "licencas", label: "Licenças", icon: Shield },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export function Navigation({ activeItem, onItemClick }: NavigationProps) {
  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}