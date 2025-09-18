import { useState } from "react";
import { Plus, Shield, Users, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const mockAccessGroups = [
  {
    id: "ag1",
    name: "Porteiros",
    description: "Acesso completo ao sistema de portaria",
    users: 12,
    permissions: [
      "Visualizar câmeras",
      "Abrir portões",
      "Registrar visitantes",
      "Gerenciar correspondência"
    ],
    createdAt: "2024-01-10"
  },
  {
    id: "ag2",
    name: "Administrativo",
    description: "Acesso administrativo e relatórios",
    users: 8,
    permissions: [
      "Visualizar relatórios",
      "Gerenciar usuários",
      "Configurações básicas",
      "Exportar dados"
    ],
    createdAt: "2024-01-15"
  },
  {
    id: "ag3",
    name: "Moradores",
    description: "Acesso limitado para moradores",
    users: 25,
    permissions: [
      "Visualizar próprios dados",
      "Agendar visitas",
      "Comunicados"
    ],
    createdAt: "2024-02-01"
  },
  {
    id: "ag4",
    name: "Síndicos",
    description: "Acesso total para síndicos",
    users: 3,
    permissions: [
      "Acesso completo",
      "Gerenciar moradores",
      "Relatórios financeiros",
      "Configurações avançadas"
    ],
    createdAt: "2024-01-20"
  }
];

const availablePermissions = [
  "Visualizar câmeras",
  "Abrir portões", 
  "Registrar visitantes",
  "Gerenciar correspondência",
  "Visualizar relatórios",
  "Gerenciar usuários",
  "Configurações básicas",
  "Exportar dados",
  "Visualizar próprios dados",
  "Agendar visitas",
  "Comunicados",
  "Acesso completo",
  "Gerenciar moradores",
  "Relatórios financeiros",
  "Configurações avançadas"
];

export default function AccessGroups() {
  const [accessGroups] = useState(mockAccessGroups);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Grupos de Acesso</h2>
          <p className="text-muted-foreground">
            Gerencie grupos de acesso e permissões dos usuários
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Grupo de Acesso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Grupo de Acesso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Nome do Grupo</Label>
                <Input id="groupName" placeholder="Ex: Porteiros" />
              </div>
              <div>
                <Label htmlFor="groupDescription">Descrição</Label>
                <Textarea id="groupDescription" placeholder="Descrição do grupo de acesso" />
              </div>
              <div>
                <Label>Permissões</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={selectedPermissions.includes(permission)}
                        onCheckedChange={() => togglePermission(permission)}
                      />
                      <Label
                        htmlFor={permission}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full">Criar Grupo de Acesso</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accessGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{group.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
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
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{group.users} usuários</span>
                  </div>
                  <Badge variant="outline">
                    {group.permissions.length} permissões
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Permissões:</h4>
                  <div className="space-y-1">
                    {group.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                        <span className="text-xs text-muted-foreground">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Criado em:</span>
                    <span className="text-sm">{new Date(group.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}