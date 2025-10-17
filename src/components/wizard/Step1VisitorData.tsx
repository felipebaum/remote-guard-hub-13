import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Building, FileText, ChevronRight } from "lucide-react";
import { VisitorData } from "../QueueWizard";

interface Step1VisitorDataProps {
  data: VisitorData;
  onUpdate: (data: Partial<VisitorData>) => void;
  onNext: () => void;
  isValid: boolean;
}

const VISIT_PURPOSES = [
  "Entrega",
  "Visita social",
  "Serviço técnico",
  "Reunião de negócios",
  "Consulta médica",
  "Outro"
];

export default function Step1VisitorData({ data, onUpdate, onNext, isValid }: Step1VisitorDataProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Nome é obrigatório";
        } else if (value.trim().length < 2) {
          newErrors.name = "Nome deve ter pelo menos 2 caracteres";
        } else {
          delete newErrors.name;
        }
        break;
      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Telefone é obrigatório";
        } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) {
          newErrors.phone = "Formato inválido. Use (11) 99999-9999";
        } else {
          delete newErrors.phone;
        }
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Email inválido";
        } else {
          delete newErrors.email;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleInputChange = (field: keyof VisitorData, value: string) => {
    let formattedValue = value;
    
    if (field === "phone") {
      formattedValue = formatPhone(value);
    }
    
    onUpdate({ [field]: formattedValue });
    validateField(field, formattedValue);
  };

  const handleNext = () => {
    // Validar todos os campos obrigatórios
    const requiredFields = ["name", "phone"];
    const hasErrors = requiredFields.some(field => errors[field] || !data[field as keyof VisitorData]);
    
    if (!hasErrors) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Dados do Visitante
        </h2>
        <p className="text-gray-600">
          Preencha as informações básicas do visitante
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome Completo *
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Digite o nome completo"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Telefone */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone *
              </Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
                className={errors.phone ? "border-red-500" : ""}
                maxLength={15}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email (opcional)
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@exemplo.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empresa */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Empresa (opcional)
              </Label>
              <Input
                id="company"
                value={data.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Nome da empresa"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivo da Visita */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Motivo da Visita *
            </Label>
            <Select 
              value={data.visitPurpose} 
              onValueChange={(value) => handleInputChange("visitPurpose", value)}
            >
              <SelectTrigger className={errors.visitPurpose ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione o motivo da visita" />
              </SelectTrigger>
              <SelectContent>
                {VISIT_PURPOSES.map((purpose) => (
                  <SelectItem key={purpose} value={purpose}>
                    {purpose}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.visitPurpose && (
              <p className="text-sm text-red-500">{errors.visitPurpose}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-3">Resumo dos Dados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nome:</span> {data.name || "Não informado"}
            </div>
            <div>
              <span className="font-medium">Telefone:</span> {data.phone || "Não informado"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {data.email || "Não informado"}
            </div>
            <div>
              <span className="font-medium">Empresa:</span> {data.company || "Não informado"}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Motivo:</span> {data.visitPurpose || "Não informado"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Próximo */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="flex items-center gap-2"
        >
          Próximo Passo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
