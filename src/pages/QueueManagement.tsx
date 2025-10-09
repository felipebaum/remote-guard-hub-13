import { useState, useEffect } from "react";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Clock, 
  User, 
  Building, 
  ArrowUpDown,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Save,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  Camera,
  FileText,
  Car,
  CreditCard,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Tipos de contato
type ContactType = "elevator" | "main_gate" | "resident_call";

// Status da chamada
type CallStatus = "waiting" | "active" | "on_hold" | "completed";

// Interface para uma chamada
interface Call {
  id: string;
  type: ContactType;
  callerName: string;
  callerInfo: string;
  building: string;
  apartment?: string;
  status: CallStatus;
  startTime: Date;
  duration?: number;
  priority: "low" | "medium" | "high" | "critical";
  hasVideo?: boolean;
}

// Interface para dados da visita
interface VisitData {
  callerName: string;
  residentName: string;
  apartment: string;
  visitReason: string;
  notes: string;
  // Dados para liberação
  fullName?: string;
  cpf?: string;
  rg?: string;
  carPlate?: string;
  carModel?: string;
  carColor?: string;
}

// Status do processo de liberação
type ReleaseStatus = "pending" | "approved" | "collecting_docs" | "completed" | "rejected";

// Interface para o processo de liberação
interface ReleaseProcess {
  status: ReleaseStatus;
  documentsCollected: boolean;
  photosTaken: boolean;
}

// Mock data para simulação
const mockBuildings = [
  "Residencial Vista Bela",
  "Condomínio Solar", 
  "Edifício Central Plaza",
  "Residencial Jardim das Flores",
  "Condomínio Primavera"
];

const mockResidents = [
  "João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira",
  "Roberto Silva", "Carmen Lopez", "Carlos Lima", "Julia Ferreira"
];

// Dados para apartamentos
const mockApartments = [
  "101", "102", "103", "104", "105", "106", "107", "108", "109", "110",
  "201", "202", "203", "204", "205", "206", "207", "208", "209", "210",
  "301", "302", "303", "304", "305", "306", "307", "308", "309", "310",
  "401", "402", "403", "404", "405", "406", "407", "408", "409", "410",
  "501", "502", "503", "504", "505", "506", "507", "508", "509", "510"
];

const mockBlocks = ["A", "B", "C", "D", "E"];

const generateMockCall = (): Call => {
  const types: ContactType[] = ["elevator", "main_gate", "resident_call"];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const building = mockBuildings[Math.floor(Math.random() * mockBuildings.length)];
  const resident = mockResidents[Math.floor(Math.random() * mockResidents.length)];
  
  // Elevadores têm prioridade crítica
  const priority = type === "elevator" ? "critical" : 
                  type === "main_gate" ? "high" : "medium";
  
  let callerName = "";
  let callerInfo = "";
  let apartment = "";
  let hasVideo = false;
  
  switch (type) {
    case "elevator":
      callerName = `Elevador - ${building}`;
      callerInfo = `Torre ${Math.floor(Math.random() * 3) + 1}`;
      apartment = `Apto ${mockApartments[Math.floor(Math.random() * mockApartments.length)]}`;
      break;
    case "main_gate":
      callerName = `Portaria Principal - ${building}`;
      callerInfo = "Solicitação de acesso";
      hasVideo = true; // Portaria tem vídeo
      break;
    case "resident_call":
      callerName = resident;
      callerInfo = building;
      apartment = `Apto ${mockApartments[Math.floor(Math.random() * mockApartments.length)]}`;
      break;
  }
  
  return {
    id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    callerName,
    callerInfo,
    building,
    apartment,
    status: "waiting",
    startTime: new Date(),
    priority,
    hasVideo
  };
};

export default function QueueManagement() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [videoScene, setVideoScene] = useState(0); // Para variar a cena do vídeo
  const [isCallingDestination, setIsCallingDestination] = useState(false);
  const [destinationResponse, setDestinationResponse] = useState<"pending" | "approved" | "rejected" | null>(null);
  const [isReturningToCaller, setIsReturningToCaller] = useState(false);
  const [releaseProcess, setReleaseProcess] = useState<ReleaseProcess>({
    status: "pending",
    documentsCollected: false,
    photosTaken: false
  });
  const [currentStep, setCurrentStep] = useState<"data" | "call" | "documents" | "photos" | "complete">("data");
  const [visitData, setVisitData] = useState<VisitData>({
    callerName: "",
    residentName: "",
    apartment: "",
    visitReason: "",
    notes: ""
  });

  // Simular chegada de novas chamadas
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de chance a cada 3 segundos
        const newCall = generateMockCall();
        setCalls(prev => [...prev, newCall]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Timer para duração da chamada ativa
  useEffect(() => {
    if (activeCall && !isOnHold) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeCall, isOnHold]);

  // Alternar cenas do vídeo a cada 5 segundos
  useEffect(() => {
    if (activeCall?.hasVideo && isVideoEnabled) {
      const interval = setInterval(() => {
        setVideoScene(prev => (prev + 1) % 3); // 3 cenas diferentes
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeCall?.hasVideo, isVideoEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getContactIcon = (type: ContactType) => {
    switch (type) {
      case "elevator":
        return <ArrowUpDown className="h-4 w-4" />;
      case "main_gate":
        return <Building className="h-4 w-4" />;
      case "resident_call":
        return <User className="h-4 w-4" />;
    }
  };

  const getContactTypeLabel = (type: ContactType) => {
    switch (type) {
      case "elevator":
        return "Elevador";
      case "main_gate":
        return "Portaria";
      case "resident_call":
        return "Morador";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "secondary";
      case "medium":
        return "default";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "critical":
        return "Crítica";
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return "Baixa";
    }
  };

  const renderVideoScene = () => {
    const scenes = [
      // Cena 1: Pessoa esperando na portaria
      () => (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-700 border-t-4 border-yellow-400">
            <div className="absolute bottom-2 left-4 right-4 h-8 bg-gray-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-mono">PORTA PRINCIPAL</span>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-20 bg-blue-500 rounded-t-full relative animate-pulse">
              <div className="w-8 h-8 bg-pink-300 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2"></div>
              <div className="absolute -left-2 top-2 w-4 h-8 bg-blue-400 rounded-full"></div>
              <div className="absolute -right-2 top-2 w-4 h-8 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
      
      // Cena 2: Pessoa caminhando
      () => (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-700 border-t-4 border-yellow-400">
            <div className="absolute bottom-2 left-4 right-4 h-8 bg-gray-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-mono">ENTRADA PRINCIPAL</span>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/3 transform -translate-x-1/2">
            <div className="w-16 h-20 bg-green-500 rounded-t-full relative animate-bounce">
              <div className="w-8 h-8 bg-pink-300 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2"></div>
              <div className="absolute -left-2 top-2 w-4 h-8 bg-green-400 rounded-full"></div>
              <div className="absolute -right-2 top-2 w-4 h-8 bg-green-400 rounded-full"></div>
            </div>
          </div>
          <div className="absolute top-4 left-4 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
        </div>
      ),
      
      // Cena 3: Pessoa no interfone
      () => (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-700 border-t-4 border-yellow-400">
            <div className="absolute bottom-2 left-4 right-4 h-8 bg-gray-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-mono">INTERFONE</span>
            </div>
          </div>
          <div className="absolute bottom-12 right-1/4">
            <div className="w-16 h-20 bg-purple-500 rounded-t-full relative animate-pulse">
              <div className="w-8 h-8 bg-pink-300 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2"></div>
              <div className="absolute -left-2 top-2 w-4 h-8 bg-purple-400 rounded-full"></div>
              <div className="absolute -right-2 top-2 w-4 h-8 bg-purple-400 rounded-full"></div>
            </div>
          </div>
          <div className="absolute top-6 right-6 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-12 right-12 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      )
    ];

    return scenes[videoScene]();
  };

  // Cenas para Câmera 1 - Portão
  const renderCamera1Scene = () => {
    const scenes = [
      // Cena 1: Portão fechado
      () => (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-gray-800">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-700">
            <div className="absolute bottom-2 left-2 right-2 h-6 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-mono">PORTÃO 1</span>
            </div>
          </div>
          <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute top-6 left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
      ),
      
      // Cena 2: Portão abrindo
      () => (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-gray-800">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-700">
            <div className="absolute bottom-2 left-2 right-2 h-6 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-mono">ABRINDO...</span>
            </div>
          </div>
          <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <div className="absolute top-6 left-2 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
        </div>
      ),
      
      // Cena 3: Portão aberto
      () => (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-gray-800">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-700">
            <div className="absolute bottom-2 left-2 right-2 h-6 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-mono">ABERTO</span>
            </div>
          </div>
          <div className="absolute top-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-6 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        </div>
      )
    ];

    return scenes[(videoScene + 1) % 3]();
  };

  // Cenas para Câmera 2 - Portão
  const renderCamera2Scene = () => {
    const scenes = [
      // Cena 1: Área externa
      () => (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-gray-800">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-600">
            <div className="absolute bottom-1 left-1 right-1 h-4 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-mono">ÁREA EXTERNA</span>
            </div>
          </div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse"></div>
        </div>
      ),
      
      // Cena 2: Movimento detectado
      () => (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-gray-800">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-600">
            <div className="absolute bottom-1 left-1 right-1 h-4 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-mono">MOVIMENTO</span>
            </div>
          </div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-red-300 rounded-full animate-pulse"></div>
        </div>
      ),
      
      // Cena 3: Área livre
      () => (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-gray-800">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-600">
            <div className="absolute bottom-1 left-1 right-1 h-4 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-mono">LIVRE</span>
            </div>
          </div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
          <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-green-300 rounded-full animate-pulse"></div>
        </div>
      )
    ];

    return scenes[(videoScene + 2) % 3]();
  };

  const handleAnswerCall = (call: Call) => {
    if (activeCall) {
      // Colocar chamada atual em espera
      setActiveCall(prev => prev ? { ...prev, status: "on_hold" } : null);
      setIsOnHold(true);
    }
    
    setActiveCall({ ...call, status: "active" });
    setCalls(prev => prev.filter(c => c.id !== call.id));
    setCallDuration(0);
    
    // Mostrar formulário de anotação para TODAS as chamadas
    setShowVisitForm(true);
    setVisitData({
      callerName: call.callerName,
      residentName: "",
      apartment: call.apartment || "",
      visitReason: "",
      notes: ""
    });
  };

  const handleHoldCall = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, status: "on_hold" } : null);
      setIsOnHold(!isOnHold);
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
    setIsOnHold(false);
    setIsMuted(false);
    setIsVideoEnabled(true);
    setCallDuration(0);
    setShowVisitForm(false);
    setDestinationResponse(null);
    setIsCallingDestination(false);
    setIsReturningToCaller(false);
    setCurrentStep("data");
    setReleaseProcess({ status: "pending", documentsCollected: false, photosTaken: false });
    setVisitData({
      callerName: "",
      residentName: "",
      apartment: "",
      visitReason: "",
      notes: ""
    });
  };

  const handleSaveVisitData = () => {
    // Aqui você pode salvar os dados da visita
    console.log("Dados da visita:", visitData);
    alert("Dados da visita salvos com sucesso!");
    // Modal permanece aberto - não fechamos o showVisitForm
  };

  const handleCallDestination = () => {
    if (!visitData.apartment || !visitData.residentName) {
      alert("Por favor, preencha o apartamento e o nome do morador antes de ligar.");
      return;
    }
    
    // Simular ligação para o destino
    setIsCallingDestination(true);
    setDestinationResponse("pending");
    setCurrentStep("call");
    
    // Simular resposta do morador após 3-5 segundos
    setTimeout(() => {
      setIsCallingDestination(false);
      // Simular resposta aleatória (na prática seria a resposta real do morador)
      const responses: ("approved" | "rejected")[] = ["approved", "rejected"];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setDestinationResponse(response);
    }, Math.random() * 2000 + 3000); // Entre 3 e 5 segundos
  };

  const handleApproveAccess = () => {
    setDestinationResponse("approved");
    setReleaseProcess({ status: "collecting_docs", documentsCollected: false, photosTaken: false });
    setCurrentStep("documents");
    alert("Acesso aprovado! Agora vamos coletar os documentos do visitante.");
  };

  const handleRejectAccess = () => {
    setDestinationResponse("rejected");
    setIsReturningToCaller(true);
    alert("Acesso negado! O visitante não pode entrar.");
    
    // Retornar para a ligação com o solicitante após 2 segundos
    setTimeout(() => {
      setShowVisitForm(false);
      setDestinationResponse(null);
      setIsCallingDestination(false);
      setIsReturningToCaller(false);
      setCurrentStep("data");
      setReleaseProcess({ status: "pending", documentsCollected: false, photosTaken: false });
    }, 2000);
  };

  const handleCollectDocuments = () => {
    setReleaseProcess(prev => ({ ...prev, documentsCollected: true }));
    setCurrentStep("photos");
    alert("Documentos coletados! Agora vamos tirar as fotos necessárias.");
  };

  const handleTakePhotos = () => {
    setReleaseProcess(prev => ({ ...prev, photosTaken: true }));
    setCurrentStep("complete");
    alert("Fotos tiradas com sucesso! Processo de liberação concluído.");
  };

  const handleCompleteRelease = () => {
    setReleaseProcess({ status: "completed", documentsCollected: true, photosTaken: true });
    setIsReturningToCaller(true);
    alert("Liberação concluída! O visitante pode entrar.");
    
    // Retornar para a ligação com o solicitante após 2 segundos
    setTimeout(() => {
      setShowVisitForm(false);
      setDestinationResponse(null);
      setIsCallingDestination(false);
      setIsReturningToCaller(false);
      setCurrentStep("data");
      setReleaseProcess({ status: "pending", documentsCollected: false, photosTaken: false });
    }, 2000);
  };

  const handleGoBack = () => {
    if (currentStep === "photos") {
      setCurrentStep("documents");
    } else if (currentStep === "documents") {
      setCurrentStep("call");
    }
  };

  const handleCloseForm = () => {
    setShowVisitForm(false);
    setDestinationResponse(null);
    setIsCallingDestination(false);
    setIsReturningToCaller(false);
    setCurrentStep("data");
    setReleaseProcess({ status: "pending", documentsCollected: false, photosTaken: false });
  };

  const handleResumeCall = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, status: "active" } : null);
      setIsOnHold(false);
    }
  };

  const handleTransferCall = () => {
    // Implementar lógica de transferência
    alert("Funcionalidade de transferência será implementada");
  };

  const waitingCalls = calls.filter(call => call.status === "waiting");
  const onHoldCalls = calls.filter(call => call.status === "on_hold");

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fila de Atendimento</h2>
          <p className="text-muted-foreground">
            Gerencie as chamadas e contatos em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </Badge>
        </div>
      </div>

      {/* Layout 3 Colunas - Estilo Central de Portaria */}
      {activeCall && activeCall.hasVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* COLUNA ESQUERDA (35%) - Painel de Câmeras */}
          <div className="lg:col-span-4 space-y-2">
            <div className="bg-gray-900 p-3 rounded-lg border border-cyan-500/30">
              <h3 className="text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-wide">
                📹 Câmeras - Entrada de Veículos
              </h3>
              
              {/* Feed Principal - Grande */}
              <div className="mb-2">
                <div className="aspect-video bg-black rounded border-2 border-cyan-500/50 relative overflow-hidden group">
                  {isVideoEnabled ? (
                    <div className="relative w-full h-full">
                      {renderVideoScene()}
                      <div className="absolute top-2 left-2 bg-black/70 text-cyan-400 px-2 py-1 rounded text-xs font-mono">
                        CÂM 01: ROSTO
                      </div>
                      {/* Controles sobrepostos */}
                      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-black/70 hover:bg-black/90 text-white p-1.5 rounded" title="Snapshot">
                          <Camera className="h-3 w-3" />
                        </button>
                        <button className="bg-black/70 hover:bg-black/90 text-white p-1.5 rounded" title="Zoom">
                          <Video className="h-3 w-3" />
                        </button>
                        <button className={`bg-black/70 hover:bg-black/90 p-1.5 rounded ${!isMuted ? 'text-green-400' : 'text-gray-400'}`} title="Áudio">
                          <Mic className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-white h-full flex items-center justify-center">
                      <VideoOff className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </div>

              {/* Feeds Secundários - Lado a Lado */}
              <div className="grid grid-cols-2 gap-2">
                {/* Câmera 2 - Placa */}
                <div className="aspect-video bg-black rounded border border-gray-600 relative overflow-hidden group cursor-pointer hover:border-cyan-500/50">
                  {isVideoEnabled ? (
                    <div className="relative w-full h-full">
                      {renderCamera1Scene()}
                      <div className="absolute top-1 left-1 bg-black/70 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        CÂM 02: PLACA
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Video className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-white h-full flex items-center justify-center">
                      <Camera className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Câmera 3 - Eclusa */}
                <div className="aspect-video bg-black rounded border border-gray-600 relative overflow-hidden group cursor-pointer hover:border-cyan-500/50">
                  {isVideoEnabled ? (
                    <div className="relative w-full h-full">
                      {renderCamera2Scene()}
                      <div className="absolute top-1 left-1 bg-black/70 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        CÂM 03: ECLUSA
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Video className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-white h-full flex items-center justify-center">
                      <Camera className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Controles da Chamada */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400">Tempo:</div>
                    <div className="text-sm font-mono font-bold text-cyan-400">
                      {formatTime(callDuration)}
                    </div>
                  </div>
                  <Badge variant={getPriorityColor(activeCall.priority)} className="text-[10px]">
                    {getPriorityLabel(activeCall.priority)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={handleHoldCall} className="flex-1 h-7 text-xs">
                    {isOnHold ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                    {isOnHold ? "Retomar" : "Pausar"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsMuted(!isMuted)} className="flex-1 h-7 text-xs">
                    {isMuted ? <MicOff className="h-3 w-3 mr-1" /> : <Mic className="h-3 w-3 mr-1" />}
                    {isMuted ? "Ativar" : "Mutar"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleEndCall} className="h-7 px-2">
                    <PhoneOff className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA CENTRAL (45%) - Fluxo de Atendimento Compacto */}
          <div className="lg:col-span-5 space-y-1.5">
            <div className="bg-white p-2 rounded-lg border shadow-sm">
              {/* Header com Condomínio e Status na mesma linha */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-blue-600" />
                  <div>
                    <div className="text-[10px] text-gray-500">Condomínio</div>
                    <div className="text-xs font-semibold text-gray-800">{activeCall.building}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  currentStep === "data" ? "bg-yellow-400 text-black" :
                  currentStep === "call" ? "bg-blue-500 text-white" :
                  currentStep === "documents" || currentStep === "photos" ? "bg-green-500 text-white" :
                  currentStep === "complete" ? "bg-green-600 text-white" :
                  "bg-gray-200 text-gray-700"
                }`}>
                  {currentStep === "data" && "⏳ Identificando"}
                  {currentStep === "call" && "📞 Ligando"}
                  {currentStep === "documents" && "📄 Documentos"}
                  {currentStep === "photos" && "📸 Fotos"}
                  {currentStep === "complete" && "✅ OK"}
                </div>
              </div>

              {/* Grid 2 colunas para visitante e morador */}
              <div className="grid grid-cols-2 gap-2">
                {/* Coluna 1: Visitante */}
                <div className="bg-gray-50 p-2 rounded border">
                  <h4 className="text-[10px] font-semibold text-gray-700 mb-1.5 uppercase">👤 Visitante</h4>
                  <div className="space-y-1.5">
                    <div>
                      <Input 
                        value={visitData.fullName || ""}
                        onChange={(e) => setVisitData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Nome Completo do Visitante" 
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <Input 
                        value={visitData.cpf || ""}
                        onChange={(e) => setVisitData(prev => ({ ...prev, cpf: e.target.value }))}
                        placeholder="CPF" 
                        className="h-7 text-xs"
                      />
                      <Input 
                        value={visitData.rg || ""}
                        onChange={(e) => setVisitData(prev => ({ ...prev, rg: e.target.value }))}
                        placeholder="RG" 
                        className="h-7 text-xs"
                      />
                    </div>
                    <Select value={visitData.visitReason} onValueChange={(value) => setVisitData(prev => ({ ...prev, visitReason: value }))}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="convidado">Convidado</SelectItem>
                        <SelectItem value="entrega">Entrega</SelectItem>
                        <SelectItem value="servico">Serviço</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 gap-1">
                      <Input 
                        value={visitData.carModel || ""}
                        onChange={(e) => setVisitData(prev => ({ ...prev, carModel: e.target.value }))}
                        placeholder="Veículo" 
                        className="h-7 text-xs"
                      />
                      <div className="relative">
                        <Input 
                          value={visitData.carPlate || "ABC-1234"}
                          placeholder="Placa" 
                          className="h-7 text-xs bg-gray-100 pr-6"
                          readOnly
                        />
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-500 text-xs" title="Auto">✨</div>
                      </div>
                    </div>
                    <Textarea 
                      value={visitData.notes || ""}
                      onChange={(e) => setVisitData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações adicionais..." 
                      className="h-12 text-xs resize-none"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Coluna 2: Morador */}
                <div className="bg-gray-50 p-2 rounded border">
                  <h4 className="text-[10px] font-semibold text-gray-700 mb-1.5 uppercase">🏠 Morador</h4>
                  <div className="space-y-1.5">
                    <Select 
                      value={visitData.apartment} 
                      onValueChange={(value) => {
                        setVisitData(prev => ({ ...prev, apartment: value }));
                        const mockResident = value ? mockResidents[Math.floor(Math.random() * mockResidents.length)] : "";
                        setVisitData(prev => ({ ...prev, residentName: mockResident }));
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Selecionar Apto" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {mockBlocks.map(block => (
                          <div key={block}>
                            <div className="px-2 py-0.5 text-[10px] font-semibold text-muted-foreground bg-gray-100">
                              Bloco {block}
                            </div>
                            {mockApartments.slice(0, 8).map(apt => (
                              <SelectItem key={`${block}-${apt}`} value={`${block}-${apt}`} className="text-xs">
                                {block}-{apt}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {visitData.apartment && (
                      <>
                        <div className="bg-white p-1.5 rounded border text-xs">
                          <div className="font-medium">{visitData.apartment}</div>
                          <div className="text-gray-600 text-[10px]">{visitData.residentName || "Fernanda Lima"}</div>
                        </div>
                        <div className="p-1.5 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-[10px] text-yellow-800">⚠️ Sem entregas após 22h</p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <Button 
                            onClick={handleCallDestination}
                            className="bg-blue-600 hover:bg-blue-700 h-7 text-[10px] px-2"
                            disabled={isCallingDestination}
                          >
                            {isCallingDestination ? (
                              <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Ligando</>
                            ) : (
                              <><Phone className="h-3 w-3 mr-1" /> Interfone</>
                            )}
                          </Button>
                          <Button variant="outline" className="h-7 text-[10px] px-2">
                            <Phone className="h-3 w-3 mr-1" /> Celular
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA (20%) - Ações Rápidas */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white p-3 rounded-lg border shadow-sm">
              <h3 className="text-xs font-semibold text-green-600 mb-3 uppercase tracking-wide">
                ⚡ Ações
              </h3>
              
              {/* Botões de Liberação */}
              <div className="space-y-2">
                <Button 
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() => alert("Portão liberado!")}
                >
                  <Building className="h-4 w-4 mr-2" />
                  LIBERAR ENTRADA
                </Button>
                
                <Button 
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  onClick={() => alert("Entrada negada!")}
                >
                  <X className="h-4 w-4 mr-2" />
                  NEGAR ENTRADA
                </Button>
                
                <Button 
                  className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white font-semibold border-2 border-amber-300 animate-pulse"
                  onClick={() => alert("Alerta de pânico ativado!")}
                >
                  🚨 PÂNICO
                </Button>
              </div>
              
              {/* Histórico Recente */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Histórico Recente</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <div className="text-xs p-2 bg-gray-50 rounded border-l-2 border-green-500">
                    <div className="font-mono text-gray-500">08:22</div>
                    <div className="text-gray-700">[Veículo Entrou] Placa HJK-5678 liberada para Apto 301 pelo Op. Carlos S.</div>
                  </div>
                  <div className="text-xs p-2 bg-gray-50 rounded border-l-2 border-blue-500">
                    <div className="font-mono text-gray-500">08:20</div>
                    <div className="text-gray-700">[Pedestre Saiu] Visitante de Maria Costa (Apto 502) deixou o condomínio.</div>
                  </div>
                  <div className="text-xs p-2 bg-gray-50 rounded border-l-2 border-red-500">
                    <div className="font-mono text-gray-500">08:18</div>
                    <div className="text-gray-700">[Alerta] Tentativa de entrada sem interfone na Portaria 2.</div>
                  </div>
                  <div className="text-xs p-2 bg-gray-50 rounded border-l-2 border-purple-500">
                    <div className="font-mono text-gray-500">08:15</div>
                    <div className="text-gray-700">[App] Morador João P. (Apto 101) liberou QR Code para visitante "Ana Clara".</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Dados da Chamada - Wizard Layout (ANTIGO - Manter para outras chamadas) */}
      {showVisitForm && activeCall && !activeCall.hasVideo && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Atendimento - {activeCall.type === "elevator" ? "Elevador" : 
                                  activeCall.type === "main_gate" ? "Portaria" : "Morador"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseForm}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Progresso do Wizard */}
            {activeCall.type === "main_gate" && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Progresso</span>
                  <span className="text-xs text-muted-foreground">
                    {currentStep === "data" && "1/4 - Dados"}
                    {currentStep === "call" && "2/4 - Ligação"}
                    {currentStep === "documents" && "3/4 - Documentos"}
                    {currentStep === "photos" && "4/4 - Fotos"}
                    {currentStep === "complete" && "✓ Concluído"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        currentStep === "data" && step === 1 ? "bg-blue-600 text-white" :
                        currentStep === "call" && step === 2 ? "bg-blue-600 text-white" :
                        currentStep === "documents" && step === 3 ? "bg-blue-600 text-white" :
                        currentStep === "photos" && step === 4 ? "bg-blue-600 text-white" :
                        currentStep === "complete" && step <= 4 ? "bg-green-600 text-white" :
                        (currentStep === "call" && step < 2) || 
                        (currentStep === "documents" && step < 3) || 
                        (currentStep === "photos" && step < 4) || 
                        (currentStep === "complete" && step <= 4) ? "bg-green-600 text-white" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {step}
                      </div>
                      {step < 4 && (
                        <div className={`w-4 h-0.5 mx-1 ${
                          (currentStep === "call" && step < 2) || 
                          (currentStep === "documents" && step < 3) || 
                          (currentStep === "photos" && step < 4) || 
                          (currentStep === "complete" && step < 4) ? "bg-green-600" : "bg-gray-200"
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-2">
            {/* Formulário Completo - Apenas para Portaria Principal */}
            {activeCall.type === "main_gate" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Coluna Esquerda: Formulário */}
                <div className="lg:col-span-2 space-y-3">
                  {/* ETAPA 1: Dados Básicos */}
                  {currentStep === "data" && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="callerName" className="text-xs">Nome da Pessoa</Label>
                          <Input
                            id="callerName"
                            value={visitData.callerName}
                            onChange={(e) => setVisitData(prev => ({ ...prev, callerName: e.target.value }))}
                            placeholder="Nome completo"
                            className="h-8 text-sm"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="residentName" className="text-xs">Morador</Label>
                          <Input
                            id="residentName"
                            value={visitData.residentName}
                            onChange={(e) => setVisitData(prev => ({ ...prev, residentName: e.target.value }))}
                            placeholder="Nome do morador"
                            className="h-8 text-sm"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="apartment" className="text-xs">Apartamento</Label>
                          <Select value={visitData.apartment} onValueChange={(value) => setVisitData(prev => ({ ...prev, apartment: value }))}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockBlocks.map(block => (
                                <div key={block}>
                                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                    Bloco {block}
                                  </div>
                                  {mockApartments.map(apt => (
                                    <SelectItem key={`${block}-${apt}`} value={`${block}-${apt}`}>
                                      {block}-{apt}
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="visitReason" className="text-xs">Motivo</Label>
                          <Input
                            id="visitReason"
                            value={visitData.visitReason}
                            onChange={(e) => setVisitData(prev => ({ ...prev, visitReason: e.target.value }))}
                            placeholder="Motivo da visita"
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Label htmlFor="notes" className="text-xs">Observações</Label>
                        <Textarea
                          id="notes"
                          value={visitData.notes}
                          onChange={(e) => setVisitData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Observações..."
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <Button 
                          onClick={handleCallDestination}
                          className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                          disabled={!visitData.apartment || !visitData.residentName || isCallingDestination}
                        >
                          {isCallingDestination ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Ligando...
                            </>
                          ) : (
                            <>
                              <Phone className="h-3 w-3 mr-1" />
                              Ligar
                            </>
                          )}
                        </Button>
                        
                        <div className="flex gap-1">
                          <Button variant="outline" onClick={handleCloseForm} className="h-8 text-xs">
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveVisitData} className="h-8 text-xs">
                            <Save className="h-3 w-3 mr-1" />
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ETAPA 2: Ligação para Morador */}
                  {currentStep === "call" && (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          Aguardando resposta do morador
                        </h4>
                        <p className="text-sm">
                          <strong>Morador:</strong> {visitData.residentName}
                        </p>
                        <p className="text-sm">
                          <strong>Apartamento:</strong> {visitData.apartment}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => setCurrentStep("data")}>
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Voltar
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={handleCloseForm}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ETAPA 3: Coleta de Documentos */}
                  {currentStep === "documents" && (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h4 className="font-medium text-green-800">Acesso Aprovado!</h4>
                        </div>
                        <p className="text-sm text-green-700">
                          {visitData.residentName} autorizou a entrada. Agora vamos coletar os documentos do visitante.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Nome Completo do Visitante</Label>
                          <Input
                            id="fullName"
                            value={visitData.fullName || ""}
                            onChange={(e) => setVisitData(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Nome completo conforme documento"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cpf">CPF</Label>
                          <Input
                            id="cpf"
                            value={visitData.cpf || ""}
                            onChange={(e) => setVisitData(prev => ({ ...prev, cpf: e.target.value }))}
                            placeholder="000.000.000-00"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="rg">RG</Label>
                          <Input
                            id="rg"
                            value={visitData.rg || ""}
                            onChange={(e) => setVisitData(prev => ({ ...prev, rg: e.target.value }))}
                            placeholder="00.000.000-0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="carPlate">Placa do Veículo</Label>
                          <Input
                            id="carPlate"
                            value={visitData.carPlate || ""}
                            onChange={(e) => setVisitData(prev => ({ ...prev, carPlate: e.target.value }))}
                            placeholder="ABC-1234"
                          />
                        </div>

                        <div>
                          <Label htmlFor="carModel">Modelo do Veículo</Label>
                          <Input
                            id="carModel"
                            value={visitData.carModel || ""}
                            onChange={(e) => setVisitData(prev => ({ ...prev, carModel: e.target.value }))}
                            placeholder="Ex: Honda Civic"
                          />
                        </div>

                        <div>
                          <Label htmlFor="carColor">Cor do Veículo</Label>
                          <Input
                            id="carColor"
                            value={visitData.carColor || ""}
                            onChange={(e) => setVisitData(prev => ({ ...prev, carColor: e.target.value }))}
                            placeholder="Ex: Branco"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={handleGoBack}>
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Voltar
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={handleCloseForm}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleCollectDocuments}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={!visitData.fullName || !visitData.cpf}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Continuar para Fotos
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ETAPA 4: Captura de Fotos */}
                  {currentStep === "photos" && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Camera className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium text-blue-800">Captura de Fotos</h4>
                        </div>
                        <p className="text-sm text-blue-700">
                          Documentos coletados! Agora vamos tirar as fotos necessárias.
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={handleGoBack}>
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Voltar
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={handleCloseForm}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleTakePhotos}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Finalizar Captura
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ETAPA 5: Conclusão */}
                  {currentStep === "complete" && (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h4 className="font-medium text-green-800">Processo Concluído!</h4>
                        </div>
                        <p className="text-sm text-green-700">
                          Todas as informações foram coletadas. O visitante está autorizado a entrar.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-medium mb-2">Resumo da Visita</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><strong>Visitante:</strong> {visitData.fullName}</div>
                          <div><strong>CPF:</strong> {visitData.cpf}</div>
                          <div><strong>RG:</strong> {visitData.rg}</div>
                          <div><strong>Veículo:</strong> {visitData.carModel} - {visitData.carColor}</div>
                          <div><strong>Placa:</strong> {visitData.carPlate}</div>
                          <div><strong>Destino:</strong> {visitData.apartment}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => setCurrentStep("photos")}>
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Voltar
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={handleCloseForm}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleCompleteRelease}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Liberar Acesso
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Coluna Direita: Info e Ações */}
                <div className="space-y-3">
                  {/* Informações da Chamada */}
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium text-xs mb-2 text-blue-600">📋 Informações</h4>
                    <div className="space-y-1 text-xs">
                      <div><span className="font-medium">Tipo:</span> {getContactTypeLabel(activeCall.type)}</div>
                      <div><span className="font-medium">Prioridade:</span> {getPriorityLabel(activeCall.priority)}</div>
                      <div><span className="font-medium">Tempo:</span> {formatTime(callDuration)}</div>
                      {activeCall.hasVideo && (
                        <div><span className="font-medium">Vídeo:</span> {isVideoEnabled ? "Ativo" : "Off"}</div>
                      )}
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium text-xs mb-2 text-green-600">⚡ Ações Rápidas</h4>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full h-8 text-xs" variant="outline">
                        <Camera className="h-3 w-3 mr-1" />
                        Capturar Foto
                      </Button>
                      <Button size="sm" className="w-full h-8 text-xs" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Gerar Relatório
                      </Button>
                      <Button size="sm" className="w-full h-8 text-xs" variant="outline">
                        <Save className="h-3 w-3 mr-1" />
                        Salvar Dados
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Indicador de Retorno para Ligação */}
                {isReturningToCaller && (
                  <div className="col-span-2 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Retornando para ligação com solicitante</p>
                        <p className="text-sm text-blue-600">
                          {destinationResponse === "approved" 
                            ? "Acesso liberado! Informando ao visitante..." 
                            : "Acesso negado! Informando ao visitante..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status da Ligação e Resposta do Morador - Apenas na etapa de ligação */}
                {currentStep === "call" && destinationResponse && (
                  <div className="col-span-2 mt-6 p-4 bg-gray-50 rounded-lg border">
                    {isCallingDestination ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        <div>
                          <p className="font-medium">Ligando para {visitData.residentName}</p>
                          <p className="text-sm text-muted-foreground">
                            Apartamento {visitData.apartment} - Aguardando resposta...
                          </p>
                        </div>
                      </div>
                    ) : destinationResponse === "pending" ? (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium">Aguardando resposta do morador</p>
                          <p className="text-sm text-muted-foreground">
                            {visitData.residentName} - Apartamento {visitData.apartment}
                          </p>
                        </div>
                      </div>
                    ) : destinationResponse === "approved" ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Acesso APROVADO</p>
                            <p className="text-sm text-muted-foreground">
                              {visitData.residentName} autorizou a entrada do visitante
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleApproveAccess}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Continuar Processo
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleRejectAccess}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Negar Acesso
                          </Button>
                        </div>
                      </div>
                    ) : destinationResponse === "rejected" ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <XCircle className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="font-medium text-red-800">Acesso NEGADO</p>
                            <p className="text-sm text-muted-foreground">
                              {visitData.residentName} não autorizou a entrada do visitante
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleApproveAccess}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Liberar Acesso
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleRejectAccess}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Confirmar Negativa
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    {activeCall.type === "elevator" ? "Chamada do Elevador" : "Ligação do Morador"}
                  </h4>
                  <p className="text-sm">
                    <strong>Origem:</strong> {activeCall.callerName}
                  </p>
                  <p className="text-sm">
                    <strong>Condomínio:</strong> {activeCall.building}
                  </p>
                  {activeCall.apartment && (
                    <p className="text-sm">
                      <strong>Apartamento:</strong> {activeCall.apartment}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="notes">
                    {activeCall.type === "elevator" ? "Observações da Chamada" : "Observações da Ligação"}
                  </Label>
                  <Textarea
                    id="notes"
                    value={visitData.notes}
                    onChange={(e) => setVisitData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder={
                      activeCall.type === "elevator" 
                        ? "Descreva o que aconteceu no elevador, problemas relatados, etc..."
                        : "Anote o motivo da ligação, solicitação do morador, etc..."
                    }
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowVisitForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveVisitData}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Observações
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chamadas em Espera */}
      {onHoldCalls.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-5 w-5" />
              Chamadas em Espera ({onHoldCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {onHoldCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getContactIcon(call.type)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{call.callerName}</p>
                      <p className="text-sm text-muted-foreground">{call.callerInfo}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleResumeCall}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Play className="h-4 w-4" />
                    Retomar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fila de Chamadas Aguardando */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Fila de Atendimento ({waitingCalls.length})
            </div>
            <Badge variant="outline">
              Próxima em {waitingCalls.length > 0 ? "1 min" : "---"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waitingCalls.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhuma chamada aguardando atendimento no momento.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {waitingCalls
                .sort((a, b) => {
                  const priorityOrder = { high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                })
                .map((call, index) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(call.priority)}>
                          #{index + 1}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {getContactIcon(call.type)}
                          {getContactTypeLabel(call.type)}
                        </div>
                      </div>
                      
                      <Avatar>
                        <AvatarFallback>
                          {getContactIcon(call.type)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="font-semibold">{call.callerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {call.callerInfo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {call.building} {call.apartment && `- ${call.apartment}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">
                          Aguardando há {Math.floor((Date.now() - call.startTime.getTime()) / 1000)}s
                        </p>
                        <Badge variant={getPriorityColor(call.priority)}>
                          {call.priority === "high" ? "Alta Prioridade" : 
                           call.priority === "medium" ? "Média Prioridade" : "Baixa Prioridade"}
                        </Badge>
                      </div>
                      
                      <Button
                        onClick={() => handleAnswerCall(call)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Atender
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm font-medium">Ativas</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {activeCall ? 1 : 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-sm font-medium">Em Espera</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {onHoldCalls.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium">Aguardando</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {waitingCalls.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">Tempo Médio</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              2m 30s
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

