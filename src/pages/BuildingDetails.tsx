import { useState } from "react";
import { ArrowLeft, Plus, Users, Shield, Settings, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BuildingDetailsProps {
  buildingId: string;
  onBack: () => void;
}

const mockBuildingData = {
  "1": {
    id: "1",
    name: "Residencial Vista Bela",
    address: "Rua das Flores, 123 - Centro",
    integrator: "Integrador Centro",
    connectionStatus: "online" as const,
    responseTime: 15,
    sipAccount: "vista-bela@sip.defenseaccess.com",
    sipPassword: "SecurePass123!",
    sipServer: "sip.defenseaccess.com",
    sipPort: "5060",
    users: [
      { id: "1", name: "João Silva", type: "Porteiro" as const, status: "online" as const, email: "joao@email.com" },
      { id: "2", name: "Maria Santos", type: "Porteiro Remoto" as const, status: "online" as const, email: "maria@email.com" },
      { id: "3", name: "Pedro Costa", type: "Morador" as const, status: "offline" as const, email: "pedro@email.com" },
      { id: "4", name: "Ana Oliveira", type: "Administrativo" as const, status: "warning" as const, email: "ana@email.com" },
      { id: "5", name: "Roberto Silva", type: "Morador" as const, status: "online" as const, email: "roberto@email.com" },
      { id: "6", name: "Carmen Lopez", type: "Morador" as const, status: "online" as const, email: "carmen@email.com" },
    ],
    licenses: [
      { id: "lic1", name: "Licença Principal", status: "active", expires: "2024-12-31" }
    ]
  }
};

export default function BuildingDetails({ buildingId, onBack }: BuildingDetailsProps) {
  const building = mockBuildingData[buildingId as keyof typeof mockBuildingData];
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [showSipPassword, setShowSipPassword] = useState(false);

  if (!building) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Condomínio não encontrado</h2>
        </div>
      </div>
    );
  }

  const sortedUsers = [...building.users].sort((a, b) => {
    const priority = { "Porteiro": 1, "Porteiro Remoto": 2, "Morador": 3, "Administrativo": 4 };
    return priority[a.type] - priority[b.type];
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Porteiro": return "bg-blue-100 text-blue-800";
      case "Porteiro Remoto": return "bg-purple-100 text-purple-800";
      case "Morador": return "bg-green-100 text-green-800";
      case "Administrativo": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{building.name}</h2>
            <p className="text-muted-foreground">{building.address}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StatusIndicator status={building.connectionStatus} size="lg" />
          <span className="text-sm font-medium">
            {building.connectionStatus === "online" ? "Online" : 
             building.connectionStatus === "offline" ? "Offline" : "Latência Alta"}
          </span>
          {building.responseTime && (
            <span className="text-xs text-muted-foreground">
              ({building.responseTime}ms)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold">{building.users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Usuários Online</p>
                <p className="text-2xl font-bold text-status-online">
                  {building.users.filter(u => u.status === "online").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Integrador</p>
                <p className="text-lg font-semibold">{building.integrator}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="licenses">Licenças</TabsTrigger>
          <TabsTrigger value="sip">Configuração SIP</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Usuários do Condomínio</h3>
            
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Usuário ao Condomínio</DialogTitle>
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
                        <SelectItem value="Morador">Morador</SelectItem>
                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Adicionar Usuário</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sortedUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIndicator status={user.status} size="md" />
                      <div>
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Badge className={getTypeColor(user.type) + " mt-1"}>
                          {user.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="licenses">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Licenças Vinculadas</h3>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Vincular Licença
              </Button>
            </div>
            
            {building.licenses.map((license) => (
              <Card key={license.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{license.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Expira em: {new Date(license.expires).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sip">
          <Card>
            <CardHeader>
              <CardTitle>Configuração SIP do Condomínio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sipAccount">Conta SIP</Label>
                  <div className="flex gap-2">
                    <Input id="sipAccount" value={building.sipAccount} readOnly />
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="sipPassword">Senha SIP</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="sipPassword" 
                      type={showSipPassword ? "text" : "password"} 
                      value={showSipPassword ? building.sipPassword : "••••••••••"} 
                      readOnly 
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowSipPassword(!showSipPassword)}
                    >
                      {showSipPassword ? "Ocultar" : "Mostrar"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sipServer">Servidor SIP</Label>
                  <Input id="sipServer" value={building.sipServer} readOnly />
                </div>
                <div>
                  <Label htmlFor="sipPort">Porta SIP</Label>
                  <Input id="sipPort" value={building.sipPort} readOnly />
                </div>
              </div>
              <div className="flex gap-2">
                <Button>Regenerar Credenciais SIP</Button>
                <Button variant="outline">Testar Conexão SIP</Button>
                <Button variant="outline">Copiar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Condomínio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="buildingName">Nome do Condomínio</Label>
                <Input id="buildingName" value={building.name} />
              </div>
              <div>
                <Label htmlFor="buildingAddress">Endereço</Label>
                <Input id="buildingAddress" value={building.address} />
              </div>
              <div>
                <Label htmlFor="buildingIntegrator">Integrador</Label>
                <Select value={building.integrator}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Integrador Centro">Integrador Centro</SelectItem>
                    <SelectItem value="Integrador Zona Norte">Integrador Zona Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}