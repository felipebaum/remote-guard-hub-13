import { Building2, Users, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  type: "Porteiro" | "Porteiro Remoto" | "Morador" | "Administrativo";
  status: "online" | "offline" | "warning";
}

interface BuildingCardProps {
  name: string;
  address: string;
  users: User[];
  connectionStatus: "online" | "offline" | "warning";
  responseTime?: number;
  onClick?: () => void;
}

export function BuildingCard({ 
  name, 
  address, 
  users, 
  connectionStatus, 
  responseTime,
  onClick 
}: BuildingCardProps) {
  const onlineUsers = users.filter(u => u.status === "online").length;
  const totalUsers = users.length;

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status={connectionStatus} size="lg" />
            {responseTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wifi className="h-3 w-3" />
                {responseTime}ms
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {onlineUsers}/{totalUsers} usuários online
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          {users.slice(0, 3).map((user) => (
            <div key={user.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <StatusIndicator status={user.status} size="sm" />
                <span className="font-medium">{user.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {user.type}
              </Badge>
            </div>
          ))}
          {users.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{users.length - 3} mais usuários...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}