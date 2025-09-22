import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Shield, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockAdminUsers = [
  {
    id: "1",
    name: "Carlos Admin Centro",
    email: "carlos.admin@integradorcentro.com",
    integrator: "Integrador Centro",
    integratorId: "g1",
    status: "online" as const,
    permissions: ["Gerenciar condomínios", "Criar usuários", "Visualizar relatórios"],
    lastSeen: "Agora",
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Ana Admin Norte",
    email: "ana.admin@integradornorte.com",
    integrator: "Integrador Zona Norte",
    integratorId: "g2",
    status: "online" as const,
    permissions: ["Gerenciar condomínios", "Criar usuários"],
    lastSeen: "2 min atrás",
    createdAt: "2024-02-20"
  }
];

const mockIntegrators = [
  { id: "g1", name: "Integrador Centro" },
  { id: "g2", name: "Integrador Zona Norte" }
];

export default function AdminUsers() {
  const [adminUsers] = useState(mockAdminUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIntegrator, setFilterIntegrator] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIntegrator = filterIntegrator === "all" || user.integratorId === filterIntegrator;
    return matchesSearch && matchesIntegrator;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Usuários Admin dos Integradores</h2>
          <p className="text-muted-foreground">
            Gerencie os administradores responsáveis por cada integrador
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Administrador de Integrador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="adminName">Nome Completo</Label>
                <Input id="adminName" placeholder="Nome do administrador" />
              </div>
              <div>
                <Label htmlFor="adminEmail">Email</Label>
                <Input id="adminEmail" type="email" placeholder="email@exemplo.com" />
              </div>
              <div>
                <Label htmlFor="adminIntegrator">Integrador</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o integrador" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockIntegrators.map((integrator) => (
                      <SelectItem key={integrator.id} value={integrator.id}>
                        {integrator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="adminPassword">Senha</Label>
                <Input id="adminPassword" type="password" placeholder="Senha temporária" />
              </div>
              <Button className="w-full">Criar Administrador</Button>
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
        
        <Select value={filterIntegrator} onValueChange={setFilterIntegrator}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por integrador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os integradores</SelectItem>
            {mockIntegrators.map((integrator) => (
              <SelectItem key={integrator.id} value={integrator.id}>
                {integrator.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(user.status)}>
                    <StatusIndicator status={user.status} className="mr-1" />
                    {user.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.integrator}</span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Permissões:</h4>
                <div className="flex flex-wrap gap-1">
                  {user.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Última vez online: {user.lastSeen}</span>
                <span>Criado em: {user.createdAt}</span>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum administrador encontrado</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || filterIntegrator !== "all" 
                ? "Tente ajustar os filtros de busca."
                : "Crie o primeiro administrador de integrador para começar."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
