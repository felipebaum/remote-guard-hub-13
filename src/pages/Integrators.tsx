import { useEffect, useState } from "react";
import { Plus, Building2, Users, Settings, Trash2, Edit, Phone, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
    onlineUsers: 6
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
    onlineUsers: 3
  }
];

export default function Integrators() {
  const [integrators] = useState(mockGroups);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateBuildingDialogOpen, setIsCreateBuildingDialogOpen] = useState(false);
  const [selectedIntegratorId, setSelectedIntegratorId] = useState<string | null>(null);
  const [isEditBuildingDialogOpen, setIsEditBuildingDialogOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [newUserType, setNewUserType] = useState<string>("");
  const [newUserBuildingIds, setNewUserBuildingIds] = useState<string[]>([]);
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [tokenBuilding, setTokenBuilding] = useState<any>(null);
  const [buildingTokens, setBuildingTokens] = useState<Record<string, string | null>>({});
  const [buildingTokenHistory, setBuildingTokenHistory] = useState<Record<string, { token: string; createdAt: string; revokedAt?: string }[]>>({});
  const [showUsersList, setShowUsersList] = useState(false);
  const [showBuildingsList, setShowBuildingsList] = useState(false);
  const [selectedIntegratorForList, setSelectedIntegratorForList] = useState<string | null>(null);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [teamByIntegrator, setTeamByIntegrator] = useState<Record<string, { id: string; name: string; email: string; role: string }[]>>({});
  const [newTeamMember, setNewTeamMember] = useState<{ name: string; email: string; role: string }>({ name: "", email: "", role: "Admin Integrador" });

  const generateUppercaseToken = (length: number = 20) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  const openCreateBuildingDialog = (integratorId: string) => {
    setSelectedIntegratorId(integratorId);
    setIsCreateBuildingDialogOpen(true);
  };

  const openEditBuildingDialog = (building: any) => {
    setSelectedBuilding(building);
    setIsEditBuildingDialogOpen(true);
  };

  // (Removido) abertura por hash – ações ficam na engrenagem do integrador

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
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" />
              </div>
              <div>
                <Label htmlFor="address">Endereço Completo</Label>
                <Textarea id="address" placeholder="Rua, número, bairro, cidade, UF, CEP" />
              </div>
              <Button className="w-full">Criar Integrador</Button>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedIntegratorId(integrator.id); setIsCreateBuildingDialogOpen(true); }}>
                        <Plus className="h-4 w-4 mr-2" /> Novo Condomínio
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedIntegratorId(integrator.id); setIsCreateUserDialogOpen(true); setNewUserType(""); setNewUserBuildingIds([]); }}>
                        <Users className="h-4 w-4 mr-2" /> Novo Usuário
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedIntegratorForList(integrator.id); setShowUsersList(true); }}>
                        <Users className="h-4 w-4 mr-2" /> Listar Usuários
                      </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setSelectedIntegratorId(integrator.id); setIsTeamDialogOpen(true); }}>
            <Users className="h-4 w-4 mr-2" /> Gerenciar Equipe
          </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" /> Configurar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir Integrador
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                                    title="Gerenciar token"
                                    onClick={() => { setTokenBuilding(building); setIsTokenDialogOpen(true); }}
                                  >
                                    <Key className="h-3 w-3" />
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


                {/* Lista de Usuários */}
                {showUsersList && selectedIntegratorForList === integrator.id && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Lista de Usuários</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => { setShowUsersList(false); setSelectedIntegratorForList(null); }}
                      >
                        Voltar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {/* Mock de usuários para este integrador */}
                      {[
                        { id: "1", name: "João Silva", email: "joao@email.com", type: "Porteiro", status: "online" },
                        { id: "2", name: "Maria Santos", email: "maria@email.com", type: "Porteiro Remoto", status: "online" },
                        { id: "3", name: "Admin Centro", email: "admin@centro.com", type: "Admin Integrador", status: "online" }
                      ].map((user) => (
                        <Card key={user.id} className="border border-muted">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-sm">{user.name}</h5>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">{user.type}</Badge>
                                  <Badge variant={user.status === "online" ? "default" : "secondary"} className="text-xs">
                                    {user.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Seção de admin/criado em removida conforme solicitação */}
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
            {selectedIntegratorId === null && (
              <div>
                <Label>Integrador</Label>
                <Select onValueChange={(v) => setSelectedIntegratorId(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o integrador" />
                  </SelectTrigger>
                  <SelectContent>
                    {integrators.map((i) => (
                      <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="buildingName">Nome do Condomínio</Label>
              <Input id="buildingName" placeholder="Ex: Residencial Vista Bela" />
            </div>
            <div>
              <Label htmlFor="buildingAddress">Endereço</Label>
              <Textarea id="buildingAddress" placeholder="Endereço completo do condomínio" />
            </div>
            <div>
              <Label htmlFor="sipHost">Host SIP</Label>
              <Input id="sipHost" placeholder="Ex: sip.seuprovedor.com" />
            </div>
            <div>
              <Label htmlFor="sipUser">Usuário SIP</Label>
              <Input id="sipUser" placeholder="Ex: usuario@sip.seuprovedor.com" />
            </div>
            <div>
              <Label htmlFor="sipPassword">Senha SIP</Label>
              <Input id="sipPassword" type="password" placeholder="Senha da conta SIP" />
            </div>
            <Button className="w-full">Adicionar Condomínio</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Gerenciar Equipe do Integrador */}
      <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Equipe do Integrador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Membros</Label>
              <div className="border rounded-md divide-y">
                {(teamByIntegrator[selectedIntegratorId ?? ""] || []).length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">Nenhum membro cadastrado</div>
                ) : (
                  (teamByIntegrator[selectedIntegratorId ?? ""] || []).map((m) => (
                    <div key={m.id} className="p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{m.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{m.email} • {m.role}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!selectedIntegratorId) return;
                          setTeamByIntegrator((prev) => ({
                            ...prev,
                            [selectedIntegratorId]: (prev[selectedIntegratorId] || []).filter((x) => x.id !== m.id)
                          }));
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Novo Membro</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Nome"
                  value={newTeamMember.name}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newTeamMember.email}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                />
                <Select value={newTeamMember.role} onValueChange={(v) => setNewTeamMember({ ...newTeamMember, role: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin Integrador">Admin Integrador</SelectItem>
                    <SelectItem value="Atendimento">Atendimento</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (!selectedIntegratorId) return;
                    if (!newTeamMember.name || !newTeamMember.email) return;
                    const id = Math.random().toString(36).slice(2);
                    setTeamByIntegrator((prev) => ({
                      ...prev,
                      [selectedIntegratorId]: [{ id, ...newTeamMember }, ...(prev[selectedIntegratorId] || [])]
                    }));
                    setNewTeamMember({ name: "", email: "", role: "Admin Integrador" });
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </div>
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
              <Label htmlFor="editSipHost">Host SIP</Label>
              <Input 
                id="editSipHost" 
                placeholder="Ex: sip.seuprovedor.com" 
              />
            </div>
            <div>
              <Label htmlFor="editSipUser">Usuário SIP</Label>
              <Input 
                id="editSipUser" 
                placeholder="Ex: usuario@sip.seuprovedor.com" 
              />
            </div>
            <div>
              <Label htmlFor="editSipPassword">Senha SIP</Label>
              <Input 
                id="editSipPassword" 
                type="password" 
                placeholder="Senha da conta SIP" 
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

      {/* Dialog para gerenciar token do condomínio */}
      <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Token do Condomínio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Condomínio</Label>
              <div className="text-sm font-medium mt-1">{tokenBuilding?.name || ""}</div>
            </div>
            <div>
              <Label>Token atual</Label>
              <Input
                readOnly
                value={buildingTokens[tokenBuilding?.id as string] || "Sem token gerado"}
              />
            </div>
            <div>
              <Label>Histórico de tokens</Label>
              <div className="mt-2 max-h-40 overflow-auto border rounded-md p-2">
                {(() => {
                  const id = tokenBuilding?.id as string;
                  const list = (id && buildingTokenHistory[id]) ? buildingTokenHistory[id] : [];
                  if (!list.length) {
                    return <div className="text-sm text-muted-foreground">Nenhum token gerado ainda.</div>;
                  }
                  const current = buildingTokens[id] || null;
                  return (
                    <ul className="space-y-2 text-sm">
                      {list.map((entry, idx) => (
                        <li key={`${entry.token}-${idx}`} className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-mono break-all">{entry.token}</div>
                            <div className="text-xs text-muted-foreground">
                              criado em {new Date(entry.createdAt).toLocaleString('pt-BR')}
                              {entry.revokedAt && (
                                <>
                                  {" • "}revogado em {new Date(entry.revokedAt).toLocaleString('pt-BR')}
                                </>
                              )}
                            </div>
                          </div>
                          {current === entry.token && <Badge variant="outline">Atual</Badge>}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  if (!tokenBuilding?.id) return;
                  const newToken = generateUppercaseToken(20);
                  setBuildingTokens((prev) => ({ ...prev, [tokenBuilding.id]: newToken }));
                  setBuildingTokenHistory((prev) => {
                    const existing = prev[tokenBuilding.id] || [];
                    const newEntry = { token: newToken, createdAt: new Date().toISOString() };
                    return { ...prev, [tokenBuilding.id]: [newEntry, ...existing] };
                  });
                }}
              >
                Gerar Novo Token
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  if (!tokenBuilding?.id) return;
                  const id = tokenBuilding.id as string;
                  const current = buildingTokens[id];
                  setBuildingTokens((prev) => ({ ...prev, [id]: null }));
                  if (current) {
                    setBuildingTokenHistory((prev) => {
                      const existing = prev[id] || [];
                      const updated = existing.map((e) => e.token === current && !e.revokedAt ? { ...e, revokedAt: new Date().toISOString() } : e);
                      return { ...prev, [id]: updated };
                    });
                  }
                }}
              >
                Revogar Token
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para criar Usuário do Integrador */}
      <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
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
              <Label>Tipo de Perfil</Label>
              <Select value={newUserType} onValueChange={setNewUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin Integrador">Admin Integrador</SelectItem>
                  <SelectItem value="Porteiro Remoto">Porteiro Remoto</SelectItem>
                  <SelectItem value="Porteiro">Porteiro</SelectItem>
                  <SelectItem value="Atendimento">Atendimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newUserType === "Porteiro Remoto" && (
              <div>
                <Label>Condomínios com Acesso</Label>
                <div className="text-sm text-muted-foreground mb-2">
                  Selecione os condomínios ou deixe em branco para acesso a todos
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                  {(integrators.find((i) => i.id === selectedIntegratorId)?.buildings || []).map((building: any) => (
                    <div key={building.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`building-${building.id}`}
                        checked={newUserBuildingIds.includes(building.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUserBuildingIds([...newUserBuildingIds, building.id]);
                          } else {
                            setNewUserBuildingIds(newUserBuildingIds.filter(id => id !== building.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`building-${building.id}`} className="text-sm">
                        {building.name}
                      </label>
                    </div>
                  ))}
                </div>
                {newUserBuildingIds.length === 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    ✓ Acesso a todos os condomínios
                  </div>
                )}
              </div>
            )}
            <Button className="w-full">Criar Usuário</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}