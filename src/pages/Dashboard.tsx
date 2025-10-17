import { useState } from "react";
import { Plus, Filter, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingCard } from "@/components/BuildingCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockIntegrators = [
  {
    id: "g1",
    name: "Integrador Centro",
    buildings: ["1", "3"]
  },
  {
    id: "g2", 
    name: "Integrador Zona Norte",
    buildings: ["2"]
  }
];

const mockBuildings = [
  {
    id: "1",
    name: "Residencial Vista Bela",
    address: "Rua das Flores, 123 - Centro",
    groupId: "g1",
    users: [
      { id: "1", name: "João Silva", type: "Porteiro" as const, status: "online" as const },
      { id: "2", name: "Maria Santos", type: "Porteiro Remoto" as const, status: "online" as const },
      { id: "3", name: "Pedro Costa", type: "Morador" as const, status: "offline" as const },
      { id: "4", name: "Ana Oliveira", type: "Administrativo" as const, status: "warning" as const },
      { id: "5", name: "Roberto Silva", type: "Morador" as const, status: "online" as const },
      { id: "6", name: "Carmen Lopez", type: "Morador" as const, status: "online" as const },
    ],
    connectionStatus: "online" as const,
    responseTime: 15,
  },
  {
    id: "2", 
    name: "Condomínio Solar",
    address: "Av. Principal, 456 - Bairro Novo",
    groupId: "g2",
    users: [
      { id: "7", name: "Carlos Lima", type: "Porteiro" as const, status: "online" as const },
      { id: "8", name: "Julia Ferreira", type: "Morador" as const, status: "offline" as const },
      { id: "9", name: "Marcos Santos", type: "Porteiro Remoto" as const, status: "warning" as const },
      { id: "10", name: "Lucia Costa", type: "Morador" as const, status: "online" as const },
    ],
    connectionStatus: "warning" as const,
    responseTime: 89,
  },
  {
    id: "3",
    name: "Edifício Central Plaza", 
    address: "Rua Comercial, 789 - Centro",
    groupId: "g1",
    users: [
      { id: "11", name: "Roberto Alves", type: "Porteiro Remoto" as const, status: "offline" as const },
      { id: "12", name: "Fernanda Rosa", type: "Administrativo" as const, status: "online" as const },
      { id: "13", name: "Paulo Mendes", type: "Morador" as const, status: "online" as const },
    ],
    connectionStatus: "offline" as const,
    responseTime: undefined,
  },
];

const mockStats = {
  totalIntegrators: 3,
  totalBuildings: 8,
  totalUsers: 24,
  onlineUsers: 16,
};

export default function Dashboard() {
  const [buildings] = useState(mockBuildings);
  const [viewType, setViewType] = useState<"integradores" | "buildings">("buildings");

  const sortedBuildings = buildings.map(building => ({
    ...building,
    users: [...building.users].sort((a, b) => {
      const priority = { "Porteiro": 1, "Porteiro Remoto": 2, "Morador": 3, "Administrativo": 4 };
      return priority[a.type] - priority[b.type];
    })
  }));

  const integratedData = viewType === "integradores" 
    ? mockIntegrators.map(integrator => ({
        ...integrator,
        buildings: buildings.filter(b => b.groupId === integrator.id)
      }))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral dos condomínios e usuários
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={viewType} onValueChange={(value: "integradores" | "buildings") => setViewType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buildings">Por Condomínios</SelectItem>
              <SelectItem value="integradores">Por Integradores</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Integrador
          </Button>
        </div>
      </div>

      {/* Card especial para Fila V2 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">
                  Fila de Atendimento V2
                </CardTitle>
                <p className="text-blue-700 text-sm">
                  Nova versão com sistema wizard para gerenciamento completo
                </p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Novo
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-blue-800">Coleta de dados do visitante</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-blue-800">Dados do visitado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-blue-800">Autorização automática</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-blue-800">Coleta de documentos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-blue-800">Liberação de acesso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-800">Processo completo</span>
              </div>
            </div>
            <Button 
              onClick={() => window.open('/queue-v2', '_blank')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Acessar Fila V2
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Integradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalIntegrators}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Condomínios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalBuildings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuários Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuários Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-online">
              {mockStats.onlineUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          {viewType === "integradores" ? "Integradores" : "Condomínios Recentes"}
        </h3>
        
        {viewType === "integradores" ? (
          <div className="space-y-6">
            {integratedData?.map((integrator) => (
              <div key={integrator.id} className="space-y-3">
                <h4 className="text-md font-medium text-primary">{integrator.name}</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {integrator.buildings.map((building) => (
                    <BuildingCard
                      key={building.id}
                      name={building.name}
                      address={building.address}
                      users={sortedBuildings.find(b => b.id === building.id)?.users || []}
                      connectionStatus={building.connectionStatus}
                      responseTime={building.responseTime}
                      onClick={() => window.open(`/?building=${building.id}`, '_self')}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedBuildings.map((building) => (
              <BuildingCard
                key={building.id}
                name={building.name}
                address={building.address}
                users={building.users}
                connectionStatus={building.connectionStatus}
                responseTime={building.responseTime}
                onClick={() => window.open(`/?building=${building.id}`, '_self')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}