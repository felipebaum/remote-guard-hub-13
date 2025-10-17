import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  CreditCard, 
  Car, 
  Camera, 
  Upload, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle,
  User,
  Eye,
  Download
} from "lucide-react";
import { DocumentData } from "../QueueWizard";

interface Step4DocumentsProps {
  data: DocumentData;
  onUpdate: (data: Partial<DocumentData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isValid: boolean;
}

export default function Step4Documents({ data, onUpdate, onNext, onPrev, isValid }: Step4DocumentsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case "cpf":
        if (!value.trim()) {
          newErrors.cpf = "CPF é obrigatório";
        } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) {
          newErrors.cpf = "Formato inválido. Use 000.000.000-00";
        } else {
          delete newErrors.cpf;
        }
        break;
      case "rg":
        if (!value.trim()) {
          newErrors.rg = "RG é obrigatório";
        } else if (value.length < 7) {
          newErrors.rg = "RG deve ter pelo menos 7 caracteres";
        } else {
          delete newErrors.rg;
        }
        break;
      case "carPlate":
        if (value && !/^[A-Z]{3}\d{4}$/.test(value.replace(/[^A-Z0-9]/g, '')) && !/^[A-Z]{3}\d[A-Z]\d{2}$/.test(value.replace(/[^A-Z0-9]/g, ''))) {
          newErrors.carPlate = "Formato inválido. Use ABC1234 ou ABC1D23";
        } else {
          delete newErrors.carPlate;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatCarPlate = (value: string) => {
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 3)}${cleaned.slice(3)}`;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}${cleaned.slice(3, 4)}${cleaned.slice(4)}`;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}${cleaned.slice(3, 4)}${cleaned.slice(4, 5)}${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 3)}${cleaned.slice(3, 4)}${cleaned.slice(4, 5)}${cleaned.slice(5, 7)}`;
  };

  const handleInputChange = (field: keyof DocumentData, value: string) => {
    let formattedValue = value;
    
    if (field === "cpf") {
      formattedValue = formatCPF(value);
    } else if (field === "carPlate") {
      formattedValue = formatCarPlate(value);
    }
    
    onUpdate({ [field]: formattedValue });
    validateField(field, formattedValue);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }
      
      onUpdate({ photo: file });
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    // Validar campos obrigatórios
    const requiredFields = ["cpf", "rg"];
    const hasErrors = requiredFields.some(field => errors[field] || !data[field as keyof DocumentData]);
    
    if (!hasErrors) {
      onNext();
    }
  };

  const hasVehicleInfo = data.carPlate || data.carModel || data.carColor;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Documentação do Visitante
        </h2>
        <p className="text-gray-600">
          Colete os documentos de identificação e informações do veículo
        </p>
      </div>

      {/* Documentos Obrigatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPF */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                CPF *
              </Label>
              <Input
                id="cpf"
                value={data.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
                className={errors.cpf ? "border-red-500" : ""}
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500">{errors.cpf}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* RG */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="rg" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                RG *
              </Label>
              <Input
                id="rg"
                value={data.rg}
                onChange={(e) => handleInputChange("rg", e.target.value)}
                placeholder="Digite o número do RG"
                className={errors.rg ? "border-red-500" : ""}
              />
              {errors.rg && (
                <p className="text-sm text-red-500">{errors.rg}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Veículo */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Car className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Informações do Veículo (Opcional)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Placa */}
            <div className="space-y-2">
              <Label htmlFor="carPlate">Placa do Veículo</Label>
              <Input
                id="carPlate"
                value={data.carPlate || ""}
                onChange={(e) => handleInputChange("carPlate", e.target.value)}
                placeholder="ABC1234"
                className={errors.carPlate ? "border-red-500" : ""}
                maxLength={7}
              />
              {errors.carPlate && (
                <p className="text-sm text-red-500">{errors.carPlate}</p>
              )}
            </div>

            {/* Modelo */}
            <div className="space-y-2">
              <Label htmlFor="carModel">Modelo</Label>
              <Input
                id="carModel"
                value={data.carModel || ""}
                onChange={(e) => handleInputChange("carModel", e.target.value)}
                placeholder="Ex: Honda Civic"
              />
            </div>

            {/* Cor */}
            <div className="space-y-2">
              <Label htmlFor="carColor">Cor</Label>
              <Input
                id="carColor"
                value={data.carColor || ""}
                onChange={(e) => handleInputChange("carColor", e.target.value)}
                placeholder="Ex: Branco"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Foto do Visitante */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5" />
            <h3 className="font-semibold text-gray-900">Foto do Visitante (Opcional)</h3>
          </div>
          
          <div className="space-y-4">
            {!photoPreview && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Tire uma foto ou faça upload de uma imagem do visitante
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleTakePhoto}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Tirar Foto
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            )}
            
            {photoPreview && (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Preview da foto"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    onClick={() => {
                      setPhotoPreview(null);
                      onUpdate({ photo: undefined });
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  >
                    ×
                  </Button>
                </div>
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Foto capturada com sucesso
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Documentos */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-green-900 mb-3">Resumo da Documentação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">CPF:</span> {data.cpf || "Não informado"}
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">RG:</span> {data.rg || "Não informado"}
            </div>
            
            {hasVehicleInfo && (
              <>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="font-medium">Placa:</span> {data.carPlate || "Não informado"}
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="font-medium">Modelo:</span> {data.carModel || "Não informado"}
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="font-medium">Cor:</span> {data.carColor || "Não informado"}
                </div>
              </>
            )}
            
            <div className="flex items-center gap-2 md:col-span-2">
              <Camera className="h-4 w-4" />
              <span className="font-medium">Foto:</span> {data.photo ? "Capturada" : "Não capturada"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validação */}
      {!isValid && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Documentos obrigatórios:</strong> CPF e RG são obrigatórios para prosseguir.
            As informações do veículo e foto são opcionais, mas recomendadas para segurança.
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
