import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Clock } from "lucide-react";
import Step1VisitorData from "./wizard/Step1VisitorData";
import Step2VisitTarget from "./wizard/Step2VisitTarget";
import Step3Authorization from "./wizard/Step3Authorization";
import Step4Documents from "./wizard/Step4Documents";
import Step5AccessRelease from "./wizard/Step5AccessRelease";

// Interface para dados do visitante
export interface VisitorData {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  visitPurpose: string;
}

// Interface para dados do visitado
export interface VisitTargetData {
  residentName: string;
  apartment: string;
  building: string;
  phone: string;
  relationship: string;
}

// Interface para status da autorização
export interface AuthorizationStatus {
  status: "pending" | "approved" | "rejected" | "no_answer";
  contactAttempts: number;
  lastContactTime?: Date;
  notes?: string;
  callOrigin?: "intercom" | "reception" | "resident_phone";
}

// Interface para documentos
export interface DocumentData {
  cpf: string;
  rg: string;
  carPlate?: string;
  carModel?: string;
  carColor?: string;
  photo?: File;
}

// Interface para processo de liberação
export interface AccessReleaseData {
  accessType: "temporary" | "permanent";
  validUntil?: Date;
  restrictions?: string;
  notes?: string;
}

// Interface completa do wizard
export interface WizardData {
  visitor: VisitorData;
  target: VisitTargetData;
  authorization: AuthorizationStatus;
  documents: DocumentData;
  access: AccessReleaseData;
}

const STEPS = [
  { id: 1, title: "Dados do Visitante", description: "Informações básicas do visitante" },
  { id: 2, title: "Dados do Visitado", description: "Informações de quem será visitado" },
  { id: 3, title: "Autorização", description: "Contato e autorização do visitado" },
  { id: 4, title: "Documentação", description: "Coleta de documentos e identificação" },
  { id: 5, title: "Liberação", description: "Liberação de acesso" }
];

interface QueueWizardProps {
  onComplete: (data: WizardData) => void;
  onCancel: () => void;
}

export default function QueueWizard({ onComplete, onCancel }: QueueWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    visitor: {
      name: "",
      phone: "",
      email: "",
      company: "",
      visitPurpose: ""
    },
    target: {
      residentName: "",
      apartment: "",
      building: "",
      phone: "",
      relationship: ""
    },
    authorization: {
      status: "pending",
      contactAttempts: 0
    },
    documents: {
      cpf: "",
      rg: "",
      carPlate: "",
      carModel: "",
      carColor: ""
    },
    access: {
      accessType: "temporary",
      restrictions: "",
      notes: ""
    }
  });

  const updateWizardData = (section: keyof WizardData, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(wizardData);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return wizardData.visitor.name !== "" && wizardData.visitor.phone !== "";
      case 2:
        return wizardData.target.residentName !== "" && 
               wizardData.target.apartment !== "" && 
               wizardData.target.building !== "";
      case 3:
        return wizardData.authorization.status !== "pending";
      case 4:
        return wizardData.documents.cpf !== "" && wizardData.documents.rg !== "";
      case 5:
        return true;
      default:
        return false;
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (step === currentStep) {
      return <Clock className="h-5 w-5 text-blue-500" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1VisitorData
            data={wizardData.visitor}
            onUpdate={(data) => updateWizardData("visitor", data)}
            onNext={nextStep}
            isValid={isStepValid(1)}
          />
        );
      case 2:
        return (
          <Step2VisitTarget
            data={wizardData.target}
            onUpdate={(data) => updateWizardData("target", data)}
            onNext={nextStep}
            onPrev={prevStep}
            isValid={isStepValid(2)}
          />
        );
      case 3:
        return (
          <Step3Authorization
            data={wizardData.authorization}
            targetData={wizardData.target}
            onUpdate={(data) => updateWizardData("authorization", data)}
            onNext={nextStep}
            onPrev={prevStep}
            isValid={isStepValid(3)}
          />
        );
      case 4:
        return (
          <Step4Documents
            data={wizardData.documents}
            onUpdate={(data) => updateWizardData("documents", data)}
            onNext={nextStep}
            onPrev={prevStep}
            isValid={isStepValid(4)}
          />
        );
      case 5:
        return (
          <Step5AccessRelease
            data={wizardData.access}
            wizardData={wizardData}
            onUpdate={(data) => updateWizardData("access", data)}
            onComplete={handleComplete}
            onPrev={prevStep}
            isValid={isStepValid(5)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fila de Atendimento - Processo de Liberação
          </h1>
          <p className="text-gray-600">
            Sistema wizard para gerenciamento completo de visitantes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  {getStepIcon(step.id)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
          <Progress 
            value={(currentStep / STEPS.length) * 100} 
            className="h-2"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Passo {currentStep} de {STEPS.length}</span>
            <span>{Math.round((currentStep / STEPS.length) * 100)}% concluído</span>
          </div>
        </div>

        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStepIcon(currentStep)}
              {STEPS[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            Cancelar Processo
          </Button>
          
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
