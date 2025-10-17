import { useState } from "react";
import { 
  Phone, 
  PhoneCall, 
  Clock, 
  User, 
  Building, 
  Plus,
  RefreshCw,
  Settings,
  BarChart3,
  List,
  Grid,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  FileText,
  Pause,
  Play,
  PhoneOff,
  Volume2,
  Mic,
  MicOff,
  Video,
  VideoOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QueueWizard, { WizardData } from "@/components/QueueWizard";
import CompactWizard from "@/components/CompactWizard";
import ActiveCallPanel from "@/components/ActiveCallPanel";

// Interface para uma chamada
interface Call {
  id: string;
  type: "elevator" | "main_gate" | "resident_call";
  callerName: string;
  callerInfo: string;
  building: string;
  apartment?: string;
  status: "waiting" | "active" | "on_hold" | "completed";
  startTime: Date;
  duration?: number;
  priority: "low" | "medium" | "high" | "critical";
  hasVideo?: boolean;
  callOrigin?: "intercom" | "reception" | "resident_phone";
  isOnCall?: boolean;
  callStartTime?: Date;
  isPaused?: boolean;
}

// Interface para processo de liberação
interface ReleaseProcess {
  id: string;
  visitorName: string;
  residentName: string;
  apartment: string;
  building: string;
  status: "in_progress" | "completed" | "cancelled";
  startTime: Date;
  completedTime?: Date;
  wizardData?: WizardData;
}

// Mock data para simulação
const mockCalls: Call[] = [
  {
    id: "1",
    type: "main_gate",
    callerName: "Visitante no Interfone",
    callerInfo: "Entrada Social - Aguardando identificação",
    building: "Residencial Vista Bela",
    apartment: "Não identificado",
    status: "waiting",
    startTime: new Date(Date.now() - 5 * 60 * 1000),
    priority: "medium",
    hasVideo: true,
    callOrigin: "intercom",
    cameras: [
      {
        id: "cam1",
        name: "Entrada Social",
        location: "Portão Principal",
        isActive: true,
        hasVideo: true
      }
    ]
  },
  {
    id: "2",
    type: "elevator",
    callerName: "Esclusa - Condomínio Solar",
    callerInfo: "Visitante aguardando na esclusa",
    building: "Condomínio Solar",
    apartment: "Não identificado",
    status: "active",
    startTime: new Date(Date.now() - 2 * 60 * 1000),
    duration: 120,
    priority: "high",
    hasVideo: true,
    callOrigin: "reception",
    cameras: [
      {
        id: "cam1",
        name: "Esclusa Externa",
        location: "Entrada Externa",
        isActive: true,
        hasVideo: true
      },
      {
        id: "cam2",
        name: "Esclusa Interna",
        location: "Entrada Interna",
        isActive: true,
        hasVideo: true
      },
      {
        id: "cam3",
        name: "Área de Espera",
        location: "Recepção",
        isActive: false,
        hasVideo: true
      }
    ]
  },
  {
    id: "3",
    type: "resident_call",
    callerName: "Pedro Costa",
    callerInfo: "Morador - Apartamento 301",
    building: "Edifício Central Plaza",
    apartment: "301",
    status: "waiting",
    startTime: new Date(Date.now() - 1 * 60 * 1000),
    priority: "low",
    hasVideo: false,
    callOrigin: "resident_phone"
  }
];

const mockReleaseProcesses: ReleaseProcess[] = [
  {
    id: "r1",
    visitorName: "Ana Oliveira",
    residentName: "Carlos Mendes",
    apartment: "102",
    building: "Residencial Vista Bela",
    status: "completed",
    startTime: new Date(Date.now() - 30 * 60 * 1000),
    completedTime: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: "r2",
    visitorName: "Roberto Lima",
    residentName: "Fernanda Alves",
    apartment: "304",
    building: "Condomínio Solar",
    status: "in_progress",
    startTime: new Date(Date.now() - 15 * 60 * 1000)
  }
];

export default function QueueManagementV2() {
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [releaseProcesses, setReleaseProcesses] = useState<ReleaseProcess[]>(mockReleaseProcesses);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [viewMode, setViewMode] = useState<"calls" | "processes">("calls");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const [showActiveCallPanel, setShowActiveCallPanel] = useState(false);
  const [showWizardInPanel, setShowWizardInPanel] = useState(false);

  const startCall = (call: Call) => {
    setCurrentCall(call);
    setIsCallActive(true);
    setCallDuration(0);
    setShowActiveCallPanel(true);
    
    // Atualizar status da chamada
    setCalls(prev => prev.map(c => 
      c.id === call.id 
        ? { ...c, status: "active", isOnCall: true, callStartTime: new Date() }
        : c
    ));

    // Iniciar timer da chamada
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallTimer(timer);
  };

  const pauseCall = () => {
    if (currentCall) {
      setCalls(prev => prev.map(c => 
        c.id === currentCall.id 
          ? { ...c, isPaused: true }
          : c
      ));
      if (callTimer) {
        clearInterval(callTimer);
        setCallTimer(null);
      }
    }
  };

  const resumeCall = () => {
    if (currentCall) {
      setCalls(prev => prev.map(c => 
        c.id === currentCall.id 
          ? { ...c, isPaused: false }
          : c
      ));
      
      // Reiniciar timer
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      setCallTimer(timer);
    }
  };

  const endCall = () => {
    if (currentCall) {
      setCalls(prev => prev.map(c => 
        c.id === currentCall.id 
          ? { ...c, status: "completed", isOnCall: false, duration: callDuration }
          : c
      ));
    }
    
    setCurrentCall(null);
    setIsCallActive(false);
    setCallDuration(0);
    setShowActiveCallPanel(false);
    
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
  };

  const handleStartWizardFromCall = () => {
    if (currentCall) {
      setSelectedCall(currentCall);
      setShowWizardInPanel(true);
    }
  };

  const handleWizardCompleteInPanel = (wizardData: WizardData) => {
    // Criar novo processo de liberação
    const newProcess: ReleaseProcess = {
      id: `r${Date.now()}`,
      visitorName: wizardData.visitor.name,
      residentName: wizardData.target.residentName,
      apartment: wizardData.target.apartment,
      building: wizardData.target.building,
      status: "completed",
      startTime: new Date(),
      completedTime: new Date(),
      wizardData
    };

    setReleaseProcesses(prev => [newProcess, ...prev]);
    
    // Remover chamada da lista
    setCalls(prev => prev.filter(call => call.id !== currentCall?.id));
    
    // Fechar tudo
    setShowWizardInPanel(false);
    setShowActiveCallPanel(false);
    endCall();
  };

  const handleWizardCancelInPanel = () => {
    setShowWizardInPanel(false);
  };

  const getCallOriginIcon = (origin?: string) => {
    switch (origin) {
      case "intercom":
        return <Building className="h-4 w-4" />;
      case "reception":
        return <User className="h-4 w-4" />;
      case "resident_phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const getCallOriginLabel = (origin?: string) => {
    switch (origin) {
      case "intercom":
        return "Interfone";
      case "reception":
        return "Portaria";
      case "resident_phone":
        return "Telefone do Morador";
      default:
        return "Não definido";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "on_hold":
        return <Badge className="bg-blue-100 text-blue-800">Em Espera</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Concluído</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Crítica</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "elevator":
        return <Building className="h-4 w-4" />;
      case "main_gate":
        return <User className="h-4 w-4" />;
      case "resident_call":
        return <Phone className="h-4 w-4" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s atrás`;
    if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
    return `${Math.floor(diff / 3600)}h atrás`;
  };

  const handleStartWizard = (call: Call) => {
    setSelectedCall(call);
    setShowWizard(true);
  };

  const handleWizardComplete = (wizardData: WizardData) => {
    // Criar novo processo de liberação
    const newProcess: ReleaseProcess = {
      id: `r${Date.now()}`,
      visitorName: wizardData.visitor.name,
      residentName: wizardData.target.residentName,
      apartment: wizardData.target.apartment,
      building: wizardData.target.building,
      status: "completed",
      startTime: new Date(),
      completedTime: new Date(),
      wizardData
    };

    setReleaseProcesses(prev => [newProcess, ...prev]);
    
    // Remover chamada da lista
    setCalls(prev => prev.filter(call => call.id !== selectedCall?.id));
    
    setShowWizard(false);
    setSelectedCall(null);
  };

  const handleWizardCancel = () => {
    setShowWizard(false);
    setSelectedCall(null);
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || call.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredProcesses = releaseProcesses.filter(process => {
    const matchesSearch = process.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || process.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (showWizard) {
    return (
      <QueueWizard
        onComplete={handleWizardComplete}
        onCancel={handleWizardCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Fila de Atendimento V2
              </h1>
              <p className="text-gray-600">
                Sistema wizard para gerenciamento completo de visitantes
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </Button>
            </div>
          </div>
        </div>


        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Chamadas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {calls.filter(c => c.status === "active").length}
                  </p>
                </div>
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Aguardando</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {calls.filter(c => c.status === "waiting").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Processos Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {releaseProcesses.filter(p => 
                      new Date(p.startTime).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles e Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, prédio ou apartamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="waiting">Aguardando</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calls" | "processes")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Chamadas ({calls.length})
            </TabsTrigger>
            <TabsTrigger value="processes" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Processos ({releaseProcesses.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Chamadas */}
          <TabsContent value="calls" className="space-y-4">
            {filteredCalls.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma chamada encontrada
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? "Tente ajustar os filtros de busca" : "Não há chamadas no momento"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCalls.map((call) => (
                  <Card key={call.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(call.type)}
                          <CardTitle className="text-lg">{call.callerName}</CardTitle>
                        </div>
                        {getStatusBadge(call.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">{call.callerInfo}</p>
                          <p className="text-sm font-medium">{call.building}</p>
                          {call.apartment && (
                            <p className="text-sm text-gray-600">Apto {call.apartment}</p>
                          )}
                          {call.callOrigin && (
                            <div className="flex items-center gap-1 mt-1">
                              {getCallOriginIcon(call.callOrigin)}
                              <span className="text-xs text-gray-500">
                                {getCallOriginLabel(call.callOrigin)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {formatTimeAgo(call.startTime)}
                          </span>
                          {call.duration && (
                            <span className="text-gray-600">
                              {formatDuration(call.duration)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {getPriorityBadge(call.priority)}
                          {call.hasVideo && (
                            <Badge variant="outline" className="text-xs">
                              Vídeo
                            </Badge>
                          )}
                        </div>
                        
                        {call.status === "waiting" && (
                          <Button
                            onClick={() => startCall(call)}
                            className="w-full flex items-center gap-2"
                          >
                            <PhoneCall className="h-4 w-4" />
                            Atender
                          </Button>
                        )}
                        
                        {call.status === "active" && !call.isOnCall && (
                          <Button
                            onClick={() => startCall(call)}
                            className="w-full flex items-center gap-2"
                          >
                            <PhoneCall className="h-4 w-4" />
                            Reconectar
                          </Button>
                        )}

                        {call.status === "active" && call.isOnCall && (
                          <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-center gap-2 text-green-700 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span>Chamada ativa</span>
                              <span className="font-mono">
                                {call.duration ? formatDuration(call.duration) : "00:00"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Processos */}
          <TabsContent value="processes" className="space-y-4">
            {filteredProcesses.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum processo encontrado
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? "Tente ajustar os filtros de busca" : "Não há processos registrados"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProcesses.map((process) => (
                  <Card key={process.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{process.visitorName}</CardTitle>
                        {getStatusBadge(process.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Visitando: {process.residentName}</p>
                          <p className="text-sm text-gray-600">{process.building}</p>
                          <p className="text-sm text-gray-600">Apto {process.apartment}</p>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>Iniciado: {formatTimeAgo(process.startTime)}</p>
                          {process.completedTime && (
                            <p>Concluído: {formatTimeAgo(process.completedTime)}</p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <User className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <FileText className="h-4 w-4 mr-2" />
                            Relatório
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Painel de Chamada Ativa */}
      {showActiveCallPanel && currentCall && (
        <ActiveCallPanel
          call={currentCall}
          onEndCall={endCall}
          onPauseCall={pauseCall}
          onResumeCall={resumeCall}
          onStartWizard={handleStartWizardFromCall}
          duration={callDuration}
          isPaused={currentCall.isPaused || false}
          showWizard={showWizardInPanel}
          wizardComponent={
            showWizardInPanel && selectedCall ? (
              <CompactWizard
                onComplete={handleWizardCompleteInPanel}
                onCancel={handleWizardCancelInPanel}
              />
            ) : null
          }
        />
      )}
    </div>
  );
}
