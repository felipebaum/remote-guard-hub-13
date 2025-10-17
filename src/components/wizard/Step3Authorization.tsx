import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle,
  User,
  Home,
  Building,
  Users
} from "lucide-react";
import { AuthorizationStatus, VisitTargetData } from "../QueueWizard";

interface Step3AuthorizationProps {
  data: AuthorizationStatus;
  targetData: VisitTargetData;
  onUpdate: (data: Partial<AuthorizationStatus>) => void;
  onNext: () => void;
  onPrev: () => void;
  isValid: boolean;
}

export default function Step3Authorization({ 
  data, 
  targetData, 
  onUpdate, 
  onNext, 
  onPrev, 
  isValid 
}: Step3AuthorizationProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (callTimer) {
        clearInterval(callTimer);
      }
    };
  }, [callTimer]);

  const startCall = () => {
    setIsCalling(true);
    setCallDuration(0);
    onUpdate({ contactAttempts: data.contactAttempts + 1 });
    
    // Simular duração da chamada
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallTimer(timer);
  };

  const endCall = (result: "approved" | "rejected" | "no_answer") => {
    setIsCalling(false);
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    onUpdate({ 
      status: result,
      lastContactTime: new Date(),
      contactAttempts: data.contactAttempts
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case "approved":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "rejected":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "no_answer":
        return <PhoneOff className="h-6 w-6 text-yellow-500" />;
      default:
        return <Clock className="h-6 w-6 text-blue-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (data.status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Autorizado</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Negado</Badge>;
      case "no_answer":
        return <Badge className="bg-yellow-100 text-yellow-800">Sem Resposta</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Pendente</Badge>;
    }
  };

  const getCallOriginIcon = (origin: string) => {
    switch (origin) {
      case "intercom":
        return <Building className="h-4 w-4" />;
      case "reception":
        return <Users className="h-4 w-4" />;
      case "resident_phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const getCallOriginLabel = (origin: string) => {
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

  const getCallOriginDescription = (origin: string) => {
    switch (origin) {
      case "intercom":
        return "Chamada do interfone do visitante";
      case "reception":
        return "Chamada da portaria/recepção";
      case "resident_phone":
        return "Chamada direta do telefone do morador";
      default:
        return "Origem da chamada não definida";
    }
  };

  const handleNotesChange = (notes: string) => {
    onUpdate({ notes });
  };

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  const canProceed = () => {
    return data.status === "approved" || data.status === "rejected";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Autorização do Morador
        </h2>
        <p className="text-gray-600">
          Entre em contato com o morador para obter autorização
        </p>
      </div>

      {/* Informações do Morador */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados para Contato
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nome:</span> {targetData.residentName}
            </div>
            <div>
              <span className="font-medium">Apartamento:</span> {targetData.apartment}
            </div>
            <div>
              <span className="font-medium">Prédio:</span> {targetData.building}
            </div>
            <div>
              <span className="font-medium">Telefone:</span> {targetData.phone || "Não informado"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status da Autorização */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              Status da Autorização
            </h3>
            {getStatusBadge()}
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            {getStatusIcon()}
            <div>
              <p className="font-medium">
                {data.status === "pending" && "Aguardando contato"}
                {data.status === "approved" && "Autorização concedida"}
                {data.status === "rejected" && "Autorização negada"}
                {data.status === "no_answer" && "Sem resposta"}
              </p>
              <p className="text-sm text-gray-600">
                Tentativas de contato: {data.contactAttempts}
              </p>
              {data.lastContactTime && (
                <p className="text-sm text-gray-600">
                  Último contato: {data.lastContactTime.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção da Origem da Chamada */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Origem da Chamada</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => onUpdate({ callOrigin: "intercom" })}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  data.callOrigin === "intercom" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Interfone</p>
                    <p className="text-sm text-gray-600">Visitante no portão</p>
                  </div>
                </div>
              </div>
              
              <div
                onClick={() => onUpdate({ callOrigin: "reception" })}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  data.callOrigin === "reception" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Portaria</p>
                    <p className="text-sm text-gray-600">Chamada da portaria</p>
                  </div>
                </div>
              </div>
              
              <div
                onClick={() => onUpdate({ callOrigin: "resident_phone" })}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  data.callOrigin === "resident_phone" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Telefone</p>
                    <p className="text-sm text-gray-600">Morador ligou</p>
                  </div>
                </div>
              </div>
            </div>
            
            {data.callOrigin && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  {getCallOriginIcon(data.callOrigin)}
                  <span className="text-sm font-medium text-blue-900">
                    Origem selecionada: {getCallOriginLabel(data.callOrigin)}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {getCallOriginDescription(data.callOrigin)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controles de Chamada */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contato com o Morador</h3>
          
          {!isCalling && data.status === "pending" && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={startCall}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <PhoneCall className="h-4 w-4" />
                  Iniciar Chamada
                </Button>
              </div>
              
              {data.contactAttempts > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Já foram feitas {data.contactAttempts} tentativa(s) de contato. 
                    Se não conseguir contato, você pode marcar como "Sem resposta" e prosseguir.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {isCalling && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-900">Chamada em andamento</span>
                </div>
                <div className="text-2xl font-mono text-green-900">
                  {formatDuration(callDuration)}
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => endCall("approved")}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Autorizado
                </Button>
                <Button
                  onClick={() => endCall("rejected")}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Negado
                </Button>
                <Button
                  onClick={() => endCall("no_answer")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <PhoneOff className="h-4 w-4" />
                  Sem Resposta
                </Button>
              </div>
            </div>
          )}

          {!isCalling && data.status !== "pending" && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Resultado da última chamada:</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="font-medium">
                    {data.status === "approved" && "Autorização concedida"}
                    {data.status === "rejected" && "Autorização negada"}
                    {data.status === "no_answer" && "Sem resposta - pode prosseguir"}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={startCall}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PhoneCall className="h-4 w-4" />
                Nova Tentativa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Observações sobre o contato</Label>
            <Textarea
              id="notes"
              value={data.notes || ""}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Registre observações sobre a conversa, instruções especiais, etc."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alertas baseados no status */}
      {data.status === "rejected" && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Autorização negada pelo morador.</strong> O visitante não pode prosseguir 
            com o acesso. Considere cancelar o processo ou tentar novamente.
          </AlertDescription>
        </Alert>
      )}

      {data.status === "approved" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Autorização concedida!</strong> O morador confirmou a visita. 
            Você pode prosseguir para a coleta de documentos.
          </AlertDescription>
        </Alert>
      )}

      {data.status === "no_answer" && data.contactAttempts >= 2 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Múltiplas tentativas sem resposta.</strong> Após {data.contactAttempts} tentativas, 
            você pode prosseguir com o processo, mas registre as tentativas nas observações.
          </AlertDescription>
        </Alert>
      )}

      {/* Navegação */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2"
        >
          Próximo Passo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
