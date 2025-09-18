import { Shield, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">Defense Access</h1>
              <p className="text-xs opacity-90">Portal Administrativo</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline">Conectado:</span>
            <Badge variant="secondary" className="bg-green-500 text-white">
              Online
            </Badge>
            <span className="text-xs opacity-75">11ms</span>
          </div>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
            <span className="hidden sm:inline ml-2">Admin</span>
          </Button>
        </div>
      </div>
    </header>
  );
}