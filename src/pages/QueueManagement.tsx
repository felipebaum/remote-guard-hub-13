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

// Interface para eventos do histórico
interface CallEvent {
  timestamp: Date;
  type: "call_started" | "calling_resident" | "resident_answered" | "resident_rejected" | "on_hold" | "resumed" | "access_granted" | "access_denied" | "call_ended" | "observation_added";
  description: string;
  duration?: number;
}

// Interface estendida para chamadas com histórico
interface CallWithHistory extends Call {
  events: CallEvent[];
  residentCallDuration?: number;
  residentCallStartTime?: Date;
  totalDuration?: number;
  finalStatus?: "granted" | "denied" | "missed";
}

export default function QueueManagement() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [videoScene, setVideoScene] = useState(0);
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
  
  // Novos estados para controle de chamadas e histórico
  const [callHistory, setCallHistory] = useState<CallWithHistory[]>([]);
  const [missedCalls, setMissedCalls] = useState<CallWithHistory[]>([]);
  const [completedCalls, setCompletedCalls] = useState<CallWithHistory[]>([]);
  const [residentCallDuration, setResidentCallDuration] = useState(0);
  const [isOnCallWithResident, setIsOnCallWithResident] = useState(false);
  const [residentCallStartTime, setResidentCallStartTime] = useState<Date | null>(null);
  const [currentCallEvents, setCurrentCallEvents] = useState<CallEvent[]>([]);
  const [activeSection, setActiveSection] = useState<"waiting" | "missed" | "completed">("waiting");
  const [showQuickCallDialog, setShowQuickCallDialog] = useState(false);
  const [quickCallMode, setQuickCallMode] = useState<"resident" | "direct">("resident");
  const [quickCallData, setQuickCallData] = useState({
    building: "",
    apartment: "",
    resident: "",
    directNumber: ""
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

  // Timer para duração da chamada ativa (interfone)
  useEffect(() => {
    if (activeCall && !isOnHold && !isOnCallWithResident) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeCall, isOnHold, isOnCallWithResident]);

  // Timer para duração da chamada com morador
  useEffect(() => {
    if (isOnCallWithResident && residentCallStartTime) {
      const interval = setInterval(() => {
        const duration = Math.floor((Date.now() - residentCallStartTime.getTime()) / 1000);
        setResidentCallDuration(duration);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOnCallWithResident, residentCallStartTime]);

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

  // Função helper para adicionar eventos ao histórico
  const addCallEvent = (type: CallEvent["type"], description: string, duration?: number) => {
    const event: CallEvent = {
      timestamp: new Date(),
      type,
      description,
      duration
    };
    setCurrentCallEvents(prev => [...prev, event]);
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
    setCurrentCallEvents([]);
    
    // Registrar início do atendimento
    addCallEvent("call_started", `Atendimento iniciado - ${call.callerName} (${call.building})`);
    
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

  const handleEndCall = (finalStatus?: "granted" | "denied" | "missed") => {
    if (!activeCall) return;
    
    // Registrar evento de finalização
    const statusMsg = finalStatus === "granted" ? "Acesso liberado" : 
                      finalStatus === "denied" ? "Acesso negado" : 
                      "Chamada encerrada";
    addCallEvent("call_ended", statusMsg, callDuration);
    
    // Criar registro completo da chamada
    const completedCall: CallWithHistory = {
      ...activeCall,
      events: currentCallEvents,
      residentCallDuration,
      totalDuration: callDuration,
      finalStatus: finalStatus || "missed"
    };
    
    // Adicionar à lista apropriada
    if (finalStatus === "granted" || finalStatus === "denied") {
      setCompletedCalls(prev => [completedCall, ...prev]);
    } else {
      setMissedCalls(prev => [completedCall, ...prev]);
    }
    
    // Limpar estados
    setActiveCall(null);
    setIsOnHold(false);
    setIsMuted(false);
    setIsVideoEnabled(true);
    setCallDuration(0);
    setShowVisitForm(false);
    setDestinationResponse(null);
    setIsCallingDestination(false);
    setIsReturningToCaller(false);
    setIsOnCallWithResident(false);
    setResidentCallStartTime(null);
    setResidentCallDuration(0);
    setCurrentStep("data");
    setCurrentCallEvents([]);
    setReleaseProcess({ status: "pending", documentsCollected: false, photosTaken: false });
    setVisitData({
      callerName: "",
      residentName: "",
      apartment: "",
      visitReason: "",
      notes: ""
    });
  };
  
  // Função para liberar entrada, salvar dados e finalizar chamada
  const handleGrantAccess = () => {
    if (!activeCall) return;
    
    // Salvar todos os dados do visitante
    const visitInfo = {
      name: visitData.fullName || visitData.callerName,
      cpf: visitData.cpf,
      rg: visitData.rg,
      reason: visitData.visitReason,
      vehicle: visitData.carModel,
      plate: visitData.carPlate,
      apartment: visitData.apartment,
      resident: visitData.residentName,
      building: activeCall.building,
      notes: visitData.notes
    };
    
    console.log("Dados salvos:", visitInfo);
    
    // Salvar observações no histórico
    if (visitData.notes) {
      addCallEvent("observation_added", `Observação: ${visitData.notes}`);
    }
    
    // Registrar liberação com detalhes
    addCallEvent("access_granted", `Acesso liberado para ${visitData.fullName || visitData.callerName} - ${visitData.cpf || 'sem CPF'} - Destino: ${visitData.apartment || 'não informado'}`);
    
    // Finalizar com sucesso
    handleEndCall("granted");
    
    alert("✅ Acesso liberado e dados salvos com sucesso!");
  };
  
  // Função para negar entrada, salvar dados e finalizar chamada
  const handleDenyAccess = () => {
    if (!activeCall) return;
    
    // Salvar todos os dados do visitante (mesmo negado)
    const visitInfo = {
      name: visitData.fullName || visitData.callerName,
      cpf: visitData.cpf,
      rg: visitData.rg,
      reason: visitData.visitReason,
      vehicle: visitData.carModel,
      plate: visitData.carPlate,
      apartment: visitData.apartment,
      resident: visitData.residentName,
      building: activeCall.building,
      notes: visitData.notes
    };
    
    console.log("Dados salvos (acesso negado):", visitInfo);
    
    // Salvar observações no histórico
    if (visitData.notes) {
      addCallEvent("observation_added", `Observação: ${visitData.notes}`);
    }
    
    // Registrar negação com detalhes
    addCallEvent("access_denied", `Acesso negado para ${visitData.fullName || visitData.callerName} - Motivo: ${visitData.notes || 'Não autorizado'}`);
    
    // Finalizar com negação
    handleEndCall("denied");
    
    alert("🚫 Acesso negado e dados salvos!");
  };

  // Função para fazer ligação rápida
  const handleQuickCall = () => {
    if (quickCallMode === "resident") {
      if (!quickCallData.building || !quickCallData.apartment) {
        alert("Por favor, selecione o condomínio e o apartamento.");
        return;
      }
      
      alert(`📞 Ligando para ${quickCallData.resident || "morador"} - ${quickCallData.apartment} (${quickCallData.building})`);
      
      // Aqui você implementaria a lógica real de ligação
      // Por enquanto, apenas fecha o dialog
      setShowQuickCallDialog(false);
      setQuickCallData({ building: "", apartment: "", resident: "", directNumber: "" });
      
    } else {
      if (!quickCallData.directNumber) {
        alert("Por favor, digite o número para ligar.");
        return;
      }
      
      alert(`📞 Ligando para ${quickCallData.directNumber}`);
      
      // Aqui você implementaria a lógica real de ligação direta
      setShowQuickCallDialog(false);
      setQuickCallData({ building: "", apartment: "", resident: "", directNumber: "" });
    }
  };

  const handleSaveVisitData = () => {
    // Salvar observações no histórico
    if (visitData.notes) {
      addCallEvent("observation_added", `Observação: ${visitData.notes}`);
    }
    
    console.log("Dados da visita:", visitData);
    
    // Se for morador ou elevador, finalizar automaticamente a ligação
    if (activeCall && (activeCall.type === "resident_call" || activeCall.type === "elevator")) {
      addCallEvent("call_ended", `Atendimento finalizado - Observações salvas`);
      alert("✅ Observações salvas e chamada finalizada!");
      handleEndCall("granted");
    } else {
      alert("✅ Observações salvas com sucesso!");
    }
  };

  const handleCallDestination = () => {
    if (!visitData.apartment) {
      alert("Por favor, selecione o apartamento antes de ligar.");
      return;
    }
    
    // PAUSAR a ligação com o interfone automaticamente
    if (!isOnHold) {
      setIsOnHold(true);
      addCallEvent("on_hold", "Interfone colocado em espera para ligar ao morador");
    }
    
    // Registrar evento de início de ligação para morador
    addCallEvent("calling_resident", `Ligando para ${visitData.residentName || "morador"} - ${visitData.apartment}`);
    
    // Iniciar timer da ligação com morador
    setIsOnCallWithResident(true);
    setResidentCallStartTime(new Date());
    setResidentCallDuration(0);
    
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
      
      // Registrar resposta
      if (response === "approved") {
        addCallEvent("resident_answered", `Morador autorizou a entrada`, residentCallDuration);
      } else {
        addCallEvent("resident_rejected", `Morador negou a entrada`, residentCallDuration);
      }
    }, Math.random() * 2000 + 3000); // Entre 3 e 5 segundos
  };
  
  // Nova função para desligar da ligação com morador e voltar para interfone
  const handleHangUpResident = () => {
    if (isOnCallWithResident) {
      // Registrar evento de fim da ligação com morador
      addCallEvent("resumed", `Desligou do morador após ${formatTime(residentCallDuration)} - Retornando para interfone`);
      
      // Desligar da chamada com morador
      setIsOnCallWithResident(false);
      setResidentCallStartTime(null);
      setResidentCallDuration(0);
      setCurrentStep("data");
      
      // RETOMAR automaticamente a ligação com o interfone
      if (isOnHold) {
        setIsOnHold(false);
        addCallEvent("resumed", "Interfone retomado automaticamente");
      }
    }
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
          <Button 
            variant="outline" 
            onClick={() => setShowQuickCallDialog(true)}
            className="h-9"
          >
            <Phone className="h-4 w-4 mr-2" />
            Ligação Rápida
          </Button>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </Badge>
        </div>
      </div>

      {/* Modal de Ligação Rápida */}
      {showQuickCallDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQuickCallDialog(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Ligação Rápida
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowQuickCallDialog(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Seletor de Modo */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={quickCallMode === "resident" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setQuickCallMode("resident")}
                >
                  <User className="h-4 w-4 mr-1" />
                  Ligar para Morador
                </Button>
                <Button 
                  variant={quickCallMode === "direct" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setQuickCallMode("direct")}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Discar Número
                </Button>
              </div>

              {/* Modo: Ligar para Morador */}
              {quickCallMode === "resident" && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="quickBuilding" className="text-sm">Condomínio</Label>
                    <Select 
                      value={quickCallData.building} 
                      onValueChange={(value) => setQuickCallData(prev => ({ ...prev, building: value }))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione o condomínio" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockBuildings.map((building) => (
                          <SelectItem key={building} value={building}>
                            {building}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quickApartment" className="text-sm">Apartamento</Label>
                    <Select 
                      value={quickCallData.apartment} 
                      onValueChange={(value) => {
                        setQuickCallData(prev => ({ ...prev, apartment: value }));
                        const mockResident = value ? mockResidents[Math.floor(Math.random() * mockResidents.length)] : "";
                        setQuickCallData(prev => ({ ...prev, resident: mockResident }));
                      }}
                      disabled={!quickCallData.building}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione o apartamento" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {mockBlocks.map(block => (
                          <div key={block}>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-gray-100">
                              Bloco {block}
                            </div>
                            {mockApartments.slice(0, 10).map(apt => (
                              <SelectItem key={`${block}-${apt}`} value={`${block}-${apt}`}>
                                Bloco {block} - Apto {apt}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {quickCallData.apartment && (
                    <div className="p-2 bg-gray-50 border rounded">
                      <div className="text-sm font-medium">Morador: {quickCallData.resident}</div>
                      <div className="text-xs text-muted-foreground">{quickCallData.apartment}</div>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleQuickCall}
                    disabled={!quickCallData.building || !quickCallData.apartment}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar para Morador
                  </Button>
                </div>
              )}

              {/* Modo: Discar Número Direto */}
              {quickCallMode === "direct" && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="quickNumber" className="text-sm">Número de Telefone</Label>
                    <Input 
                      id="quickNumber"
                      type="tel"
                      value={quickCallData.directNumber}
                      onChange={(e) => setQuickCallData(prev => ({ ...prev, directNumber: e.target.value }))}
                      placeholder="(11) 98765-4321"
                      className="h-9"
                    />
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleQuickCall}
                    disabled={!quickCallData.directNumber}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Discar Número
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

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
                {/* Indicador de status do interfone */}
                {isOnHold && (
                  <div className="mb-2 p-1.5 bg-yellow-900/30 border border-yellow-600 rounded flex items-center gap-1">
                    <Pause className="h-3 w-3 text-yellow-400" />
                    <span className="text-[10px] text-yellow-300">Interfone em espera</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400">Interfone:</div>
                    <div className={`text-sm font-mono font-bold ${isOnHold ? 'text-yellow-400' : 'text-cyan-400'}`}>
                      {isOnHold ? '⏸️' : formatTime(callDuration)}
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
                  <Button variant="destructive" size="sm" onClick={() => handleEndCall()} className="h-7 px-2">
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

              {/* Indicador de Ligação Ativa com Morador */}
              {isOnCallWithResident && (
                <div className="mb-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg border-2 border-blue-400 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-white animate-pulse" />
                      </div>
                      <div className="text-white">
                        <div className="text-sm font-semibold">Em ligação com morador</div>
                        <div className="text-xs opacity-90">
                          {visitData.residentName || "Morador"} - {visitData.apartment}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-white">
                          {formatTime(residentCallDuration)}
                        </div>
                        <div className="text-xs text-white/80">tempo de ligação</div>
                      </div>
                      
                      <Button 
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 h-10 px-4"
                        onClick={handleHangUpResident}
                      >
                        <PhoneOff className="h-4 w-4 mr-2" />
                        Desligar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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
                  onClick={handleGrantAccess}
                  disabled={!activeCall}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Liberar Entrada e Salvar
                </Button>
                
                <Button 
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  onClick={handleDenyAccess}
                  disabled={!activeCall}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Negar Entrada e Salvar
                </Button>
                
                <Button
                  className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white font-semibold border-2 border-amber-300 animate-pulse"
                  onClick={() => alert("Alerta de pânico ativado!")}
                >
                  🚨 PÂNICO
                </Button>
              </div>
              
              {/* Histórico de Eventos da Chamada Atual */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">
                  {activeCall ? "Eventos desta Chamada" : "Últimas Chamadas"}
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activeCall && currentCallEvents.length > 0 ? (
                    currentCallEvents.map((event, index) => {
                      const borderColor = 
                        event.type === "call_started" ? "border-blue-500" :
                        event.type === "calling_resident" ? "border-purple-500" :
                        event.type === "resident_answered" ? "border-green-500" :
                        event.type === "resident_rejected" ? "border-red-500" :
                        event.type === "access_granted" ? "border-green-600" :
                        event.type === "access_denied" ? "border-red-600" :
                        "border-gray-400";
                      
                      return (
                        <div key={index} className={`text-xs p-2 bg-gray-50 rounded border-l-2 ${borderColor}`}>
                          <div className="font-mono text-gray-500">
                            {event.timestamp.toLocaleTimeString('pt-BR')}
                            {event.duration !== undefined && ` (${formatTime(event.duration)})`}
                        </div>
                          <div className="text-gray-700">{event.description}</div>
                      </div>
                      );
                    })
                  ) : (
                    <>
                      {completedCalls.slice(0, 4).map((call, index) => (
                        <div key={index} className={`text-xs p-2 bg-gray-50 rounded border-l-2 ${
                          call.finalStatus === "granted" ? "border-green-500" : "border-red-500"
                        }`}>
                          <div className="font-mono text-gray-500">
                            {call.startTime.toLocaleTimeString('pt-BR')}
                        </div>
                          <div className="text-gray-700">
                            [{call.finalStatus === "granted" ? "Liberado" : "Negado"}] {call.callerName} - {call.building}
                      </div>
                        </div>
                      ))}
                    </>
                  )}
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
                  <Button onClick={handleSaveVisitData} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {activeCall?.type === "resident_call" || activeCall?.type === "elevator" 
                      ? "Finalizar Atendimento" 
                      : "Salvar Observações"}
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

      {/* Seções de Chamadas com Tabs */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg">Gerenciamento de Chamadas</CardTitle>
            <div className="flex gap-1">
              <Button 
                variant={activeSection === "waiting" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveSection("waiting")}
                className="h-7 text-xs"
              >
                <Phone className="h-3 w-3 mr-1" />
                Aguardando ({waitingCalls.length})
              </Button>
              <Button 
                variant={activeSection === "missed" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveSection("missed")}
                className="h-7 text-xs"
              >
                <PhoneOff className="h-3 w-3 mr-1" />
                Perdidas ({missedCalls.length})
              </Button>
              <Button 
                variant={activeSection === "completed" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveSection("completed")}
                className="h-7 text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Finalizadas ({completedCalls.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          {/* Seção: Aguardando Atendimento */}
          {activeSection === "waiting" && (
            waitingCalls.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhuma chamada aguardando atendimento no momento.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {waitingCalls
                .sort((a, b) => {
                    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
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
                            {getPriorityLabel(call.priority)}
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
            )
          )}

          {/* Seção: Chamadas Perdidas */}
          {activeSection === "missed" && (
            missedCalls.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Nenhuma chamada perdida no momento.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {missedCalls.map((call) => (
                  <div
                    key={call.id}
                    className="p-4 border border-red-200 rounded-lg bg-red-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-red-800">{call.callerName}</p>
                        <p className="text-sm text-red-600">{call.building} {call.apartment && `- ${call.apartment}`}</p>
                      </div>
                      <Badge variant="destructive">Perdida</Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Início: {call.startTime.toLocaleString('pt-BR')}</div>
                      <div>Duração total: {formatTime(call.totalDuration || 0)}</div>
                      {call.events && call.events.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-blue-600 hover:underline">
                            Ver eventos ({call.events.length})
                          </summary>
                          <div className="mt-2 space-y-1 pl-2 border-l-2 border-gray-300">
                            {call.events.map((event, i) => (
                              <div key={i} className="text-xs">
                                {event.timestamp.toLocaleTimeString('pt-BR')} - {event.description}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Seção: Chamadas Finalizadas */}
          {activeSection === "completed" && (
            completedCalls.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Nenhuma chamada finalizada ainda.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {completedCalls.map((call) => (
                  <div
                    key={call.id}
                    className={`p-4 border rounded-lg ${
                      call.finalStatus === "granted" 
                        ? "border-green-200 bg-green-50" 
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className={`font-semibold ${
                          call.finalStatus === "granted" ? "text-green-800" : "text-red-800"
                        }`}>
                          {call.callerName}
                        </p>
                        <p className={`text-sm ${
                          call.finalStatus === "granted" ? "text-green-600" : "text-red-600"
                        }`}>
                          {call.building} {call.apartment && `- ${call.apartment}`}
                        </p>
                      </div>
                      <Badge variant={call.finalStatus === "granted" ? "default" : "destructive"}>
                        {call.finalStatus === "granted" ? "✅ Liberado" : "🚫 Negado"}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Início: {call.startTime.toLocaleString('pt-BR')}</div>
                      <div>Duração total: {formatTime(call.totalDuration || 0)}</div>
                      {call.residentCallDuration !== undefined && call.residentCallDuration > 0 && (
                        <div>Tempo com morador: {formatTime(call.residentCallDuration)}</div>
                      )}
                      {call.events && call.events.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-blue-600 hover:underline">
                            Ver histórico completo ({call.events.length} eventos)
                          </summary>
                          <div className="mt-2 space-y-1 pl-2 border-l-2 border-gray-300">
                            {call.events.map((event, i) => (
                              <div key={i} className="text-xs">
                                <span className="font-mono text-gray-500">
                                  {event.timestamp.toLocaleTimeString('pt-BR')}
                                </span>
                                {" - "}
                                {event.description}
                                {event.duration !== undefined && ` (${formatTime(event.duration)})`}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm font-medium">Perdidas</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {missedCalls.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
              <span className="text-sm font-medium">Finalizadas</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {completedCalls.length}
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
              {completedCalls.length > 0 
                ? formatTime(Math.floor(completedCalls.reduce((sum, call) => sum + (call.totalDuration || 0), 0) / completedCalls.length))
                : "0:00"
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

