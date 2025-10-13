import { Building, Users, Settings, Shield, BarChart3, UserCheck, UserCog, Phone, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "integradores", label: "Integradores", icon: Building },
  { id: "fila-atendimento", label: "Fila de Atendimento", icon: Phone },
  { id: "gerenciar-condominios", label: "Gerenciar Condomínios", icon: Building2 },
  // { id: "grupos-acesso", label: "Grupos de Acesso", icon: UserCheck }, // Removido: grupos de acesso não são mais necessários
  // { id: "configuracoes", label: "Configurações", icon: Settings }, // Comentado: configurações já existem por condomínio
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