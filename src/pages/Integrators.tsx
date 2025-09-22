import { useState } from "react";
import { Plus, Building2, Users, Settings, Trash2, Edit, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockGroups = [
  {
    id: "g1",
    name: "Integrador Centro",
    description: "Condomínios da região central",
    buildings: [
      {
        id: "1",
        name: "Residencial Vista Bela",
        address: "Rua das Flores, 123 - Centro",
        users: 6,
        onlineUsers: 4,
        sipAccount: "vista-bela@sip.defenseaccess.com"
      },
      {
        id: "3", 
        name: "Edifício Central Plaza",
        address: "Rua Comercial, 789 - Centro",
        users: 3,
        onlineUsers: 2,
        sipAccount: "central-plaza@sip.defenseaccess.com"
      }
    ],
    totalUsers: 9,
    onlineUsers: 6,
    adminUser: "Admin Centro",
    createdAt: "2024-01-15"
  },
  {
    id: "g2",
    name: "Integrador Zona Norte", 
    description: "Condomínios da zona norte",
    buildings: [
      {
        id: "2",
        name: "Condomínio Solar",
        address: "Av. Principal, 456 - Bairro Novo", 
        users: 4,
        onlineUsers: 3,
        sipAccount: "solar@sip.defenseaccess.com"
      }
    ],
    totalUsers: 4,
    onlineUsers: 3,
    adminUser: "Admin Norte",
    createdAt: "2024-02-20"
  }
];

export default function Integrators() {
  const [integrators] = useState(mockGroups);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateBuildingDialogOpen, setIsCreateBuildingDialogOpen] = useState(false);
  const [selectedIntegratorId, setSelectedIntegratorId] = useState<string | null>(null);
  const [isEditBuildingDialogOpen, setIsEditBuildingDialogOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);

  const openCreateBuildingDialog = (integratorId: string) => {
    setSelectedIntegratorId(integratorId);
    setIsCreateBuildingDialogOpen(true);
  };

  const openEditBuildingDialog = (building: any) => {
    setSelectedBuilding(building);
    setIsEditBuildingDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integradores</h2>
          <p className="text-muted-foreground">
            Gerencie integradores e organize seus condomínios
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Integrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Integrador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Nome do Integrador</Label>
                <Input id="groupName" placeholder="Ex: Integrador Centro" />
              </div>
              <div>
                <Label htmlFor="groupDescription">Descrição</Label>
                <Input id="groupDescription" placeholder="Descrição do integrador" />
              </div>
              <div>
                <Label htmlFor="adminUser">Usuário Administrador</Label>
                <Input id="adminUser" placeholder="Nome do administrador" />
              </div>
              <div>
                <Label htmlFor="adminEmail">Email do Administrador</Label>
                <Input id="adminEmail" type="email" placeholder="admin@exemplo.com" />
              </div>
              <div>
                <Label htmlFor="adminPassword">Senha Temporária</Label>
                <Input id="adminPassword" type="password" placeholder="Senha temporária" />
              </div>
              <Button className="w-full">Criar Integrador e Admin</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {integrators.map((integrator) => (
          <Card key={integrator.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{integrator.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{integrator.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openCreateBuildingDialog(integrator.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Condomínio
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{integrator.buildings.length} condomínios</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {integrator.onlineUsers}/{integrator.totalUsers} usuários online
                      </span>
                    </div>
                  </div>
                </div>

                {integrator.buildings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Condomínios:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {integrator.buildings.map((building) => (
                        <Card key={building.id} className="border border-muted">
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-sm">{building.name}</h5>
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => openEditBuildingDialog(building)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => window.open(`/?building=${building.id}`, '_self')}
                                  >
                                    <Building2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">{building.address}</p>
                              <div className="flex items-center justify-between text-xs">
                                <span>{building.onlineUsers}/{building.users} usuários online</span>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span>SIP</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Administrador:</span>
                    <Badge variant="outline">{integrator.adminUser}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Criado em:</span>
                    <span className="text-sm">{new Date(integrator.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-3 w-3 mr-1" />
                      Novo Admin
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configurar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog para criar condomínio */}
      <Dialog open={isCreateBuildingDialogOpen} onOpenChange={setIsCreateBuildingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Condomínio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="buildingName">Nome do Condomínio</Label>
              <Input id="buildingName" placeholder="Ex: Residencial Vista Bela" />
            </div>
            <div>
              <Label htmlFor="buildingAddress">Endereço</Label>
              <Textarea id="buildingAddress" placeholder="Endereço completo do condomínio" />
            </div>
            <div>
              <Label htmlFor="sipAccount">Conta SIP (Opcional)</Label>
              <Input id="sipAccount" placeholder="Ex: condominio@sip.defenseaccess.com" />
            </div>
            <Button className="w-full">Adicionar Condomínio</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar condomínio */}
      <Dialog open={isEditBuildingDialogOpen} onOpenChange={setIsEditBuildingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Condomínio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editBuildingName">Nome do Condomínio</Label>
              <Input 
                id="editBuildingName" 
                value={selectedBuilding?.name || ""} 
                placeholder="Nome do condomínio" 
              />
            </div>
            <div>
              <Label htmlFor="editBuildingAddress">Endereço</Label>
              <Textarea 
                id="editBuildingAddress" 
                value={selectedBuilding?.address || ""} 
                placeholder="Endereço completo do condomínio" 
              />
            </div>
            <div>
              <Label htmlFor="editSipAccount">Conta SIP</Label>
              <Input 
                id="editSipAccount" 
                value={selectedBuilding?.sipAccount || ""} 
                placeholder="Ex: condominio@sip.defenseaccess.com" 
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Salvar Alterações</Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(`/?building=${selectedBuilding?.id}`, '_self')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}