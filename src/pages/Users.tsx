import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    type: "Porteiro" as const,
    status: "online" as const,
    building: "Residencial Vista Bela",
    integrator: "Integrador Centro",
    lastSeen: "Agora",
    createdAt: "2024-01-10"
  },
  {
    id: "2", 
    name: "Maria Santos",
    email: "maria.santos@email.com",
    type: "Porteiro Remoto" as const,
    status: "online" as const,
    building: "Residencial Vista Bela",
    integrator: "Integrador Centro",
    lastSeen: "Agora",
    createdAt: "2024-01-15"
  },
  {
    id: "3",
    name: "Carlos Lima", 
    email: "carlos.lima@email.com",
    type: "Porteiro" as const,
    status: "warning" as const,
    building: "Condomínio Solar",
    integrator: "Integrador Zona Norte",
    lastSeen: "5 min atrás",
    createdAt: "2024-02-01"
  },
  {
    id: "4",
    name: "Ana Admin Centro",
    email: "ana.admin@integradorcentro.com", 
    type: "Admin Integrador" as const,
    status: "online" as const,
    building: "Integrador Centro",
    integrator: "Integrador Centro",
    lastSeen: "2 min atrás",
    createdAt: "2024-01-20"
  },
  {
    id: "5",
    name: "Pedro Admin Norte",
    email: "pedro.admin@integradornorte.com",
    type: "Admin Integrador" as const,
    status: "offline" as const,
    building: "Integrador Zona Norte",
    integrator: "Integrador Zona Norte",
    lastSeen: "1 hora atrás",
    createdAt: "2024-02-10"
  }
];

export default function Users() {
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterIntegrator, setFilterIntegrator] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || user.type === filterType;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesIntegrator = filterIntegrator === "all" || user.integrator === filterIntegrator;
    
    return matchesSearch && matchesType && matchesStatus && matchesIntegrator;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Porteiro": return "bg-blue-100 text-blue-800";
      case "Porteiro Remoto": return "bg-purple-100 text-purple-800";
      case "Admin Integrador": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Usuários Criados pelos Integradores</h2>
          <p className="text-muted-foreground">
            Gerencie porteiros, porteiros remotos e admins criados pelos integradores
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName">Nome Completo</Label>
                <Input id="userName" placeholder="Nome do usuário" />
              </div>
              <div>
                <Label htmlFor="userEmail">Email</Label>
                <Input id="userEmail" type="email" placeholder="email@exemplo.com" />
              </div>
              <div>
                <Label htmlFor="userType">Tipo de Usuário</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Porteiro">Porteiro</SelectItem>
                    <SelectItem value="Porteiro Remoto">Porteiro Remoto</SelectItem>
                    <SelectItem value="Admin Integrador">Admin Integrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="userIntegrator">Integrador</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o integrador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Integrador Centro</SelectItem>
                    <SelectItem value="2">Integrador Zona Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="userBuilding">Condomínio</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o condomínio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Residencial Vista Bela</SelectItem>
                    <SelectItem value="2">Condomínio Solar</SelectItem>
                    <SelectItem value="3">Edifício Central Plaza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Criar Usuário</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="Porteiro">Porteiro</SelectItem>
            <SelectItem value="Porteiro Remoto">Porteiro Remoto</SelectItem>
            <SelectItem value="Admin Integrador">Admin Integrador</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="warning">Latência Alta</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterIntegrator} onValueChange={setFilterIntegrator}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os integradores</SelectItem>
            <SelectItem value="Integrador Centro">Integrador Centro</SelectItem>
            <SelectItem value="Integrador Zona Norte">Integrador Zona Norte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <StatusIndicator status={user.status} size="lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getTypeColor(user.type)}>{user.type}</Badge>
                     <span className="text-xs text-muted-foreground">•</span>
                     <span className="text-xs text-muted-foreground">{user.building}</span>
                   </div>
                   <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                     <span>Integrador: {user.integrator}</span>
                     <span>•</span>
                     <span>Visto: {user.lastSeen}</span>
                   </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Nenhum usuário encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all" || filterStatus !== "all" || filterIntegrator !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Crie o primeiro usuário para começar."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}