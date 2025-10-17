import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  ChevronLeft, 
  AlertTriangle,
  User,
  Home,
  Car,
  FileText,
  Phone,
  Calendar,
  Key,
  Timer
} from "lucide-react";
import { AccessReleaseData, WizardData } from "../QueueWizard";

interface Step5AccessReleaseProps {
  data: AccessReleaseData;
  wizardData: WizardData;
  onUpdate: (data: Partial<AccessReleaseData>) => void;
  onComplete: () => void;
  onPrev: () => void;
  isValid: boolean;
}

const ACCESS_TYPES = [
  { value: "temporary", label: "Acesso Temporário", description: "Válido por tempo limitado" },
  { value: "permanent", label: "Acesso Permanente", description: "Válido até cancelamento" }
];

export default function Step5AccessRelease({ 
  data, 
  wizardData, 
  onUpdate, 
  onComplete, 
  onPrev, 
  isValid 
}: Step5AccessReleaseProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(true);

  const handleInputChange = (field: keyof AccessReleaseData, value: string | Date) => {
    onUpdate({ [field]: value });
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onComplete();
  };

  const getAuthorizationStatus = () => {
    if (wizardData.authorization.status === "approved") {
      return <Badge className="bg-green-100 text-green-800">Autorizado</Badge>;
    } else if (wizardData.authorization.status === "rejected") {
      return <Badge className="bg-red-100 text-red-800">Negado</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Sem Resposta</Badge>;
    }
  };

  const canReleaseAccess = () => {
    return wizardData.authorization.status === "approved" || 
           wizardData.authorization.status === "no_answer";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Liberação de Acesso
        </h2>
        <p className="text-gray-600">
          Configure e finalize o acesso do visitante
        </p>
      </div>

      {/* Resumo Completo */}
      {showSummary && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumo Completo do Processo
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSummary(!showSummary)}
              >
                {showSummary ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Dados do Visitante */}
              <div>
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Visitante
                </h4>
                <div className="space-y-1 text-blue-800">
                  <p><span className="font-medium">Nome:</span> {wizardData.visitor.name}</p>
                  <p><span className="font-medium">Telefone:</span> {wizardData.visitor.phone}</p>
                  <p><span className="font-medium">Motivo:</span> {wizardData.visitor.visitPurpose}</p>
                  {wizardData.visitor.company && (
                    <p><span className="font-medium">Empresa:</span> {wizardData.visitor.company}</p>
                  )}
                </div>
              </div>

              {/* Dados do Visitado */}
              <div>
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Visitado
                </h4>
                <div className="space-y-1 text-blue-800">
                  <p><span className="font-medium">Nome:</span> {wizardData.target.residentName}</p>
                  <p><span className="font-medium">Apartamento:</span> {wizardData.target.apartment}</p>
                  <p><span className="font-medium">Prédio:</span> {wizardData.target.building}</p>
                  <p><span className="font-medium">Autorização:</span> {getAuthorizationStatus()}</p>
                </div>
              </div>

              {/* Documentos */}
              <div>
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentos
                </h4>
                <div className="space-y-1 text-blue-800">
                  <p><span className="font-medium">CPF:</span> {wizardData.documents.cpf}</p>
                  <p><span className="font-medium">RG:</span> {wizardData.documents.rg}</p>
                  {wizardData.documents.carPlate && (
                    <p><span className="font-medium">Veículo:</span> {wizardData.documents.carPlate}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Status
                </h4>
                <div className="space-y-1 text-blue-800">
                  <p><span className="font-medium">Processo:</span> <Badge className="bg-blue-100 text-blue-800">Finalizando</Badge></p>
                  <p><span className="font-medium">Data/Hora:</span> {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuração do Acesso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Acesso */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Tipo de Acesso *
              </Label>
              <Select 
                value={data.accessType} 
                onValueChange={(value) => handleInputChange("accessType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de acesso" />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Validade (se temporário) */}
        {data.accessType === "temporary" && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="validUntil" className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Válido até *
                </Label>
                <Input
                  id="validUntil"
                  type="datetime-local"
                  value={data.validUntil ? new Date(data.validUntil).toISOString().slice(0, 16) : ""}
                  onChange={(e) => handleInputChange("validUntil", new Date(e.target.value))}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Restrições e Observações */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restrictions">Restrições Especiais</Label>
              <Textarea
                id="restrictions"
                value={data.restrictions || ""}
                onChange={(e) => handleInputChange("restrictions", e.target.value)}
                placeholder="Ex: Acesso apenas ao apartamento 101, não permitir acesso à piscina, etc."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações Finais</Label>
              <Textarea
                id="notes"
                value={data.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Observações adicionais sobre a liberação de acesso..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Validação */}
      {!canReleaseAccess() && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Acesso negado:</strong> O morador negou a autorização. 
            Não é possível liberar o acesso para este visitante.
          </AlertDescription>
        </Alert>
      )}

      {canReleaseAccess() && wizardData.authorization.status === "no_answer" && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Atenção:</strong> Não foi possível contatar o morador após {wizardData.authorization.contactAttempts} tentativa(s). 
            O acesso será liberado conforme política de segurança.
          </AlertDescription>
        </Alert>
      )}

      {canReleaseAccess() && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Tudo pronto!</strong> Todos os dados foram coletados e validados. 
            Você pode finalizar o processo de liberação de acesso.
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
          onClick={handleComplete}
          disabled={!canReleaseAccess() || isProcessing}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processando...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Finalizar e Liberar Acesso
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
