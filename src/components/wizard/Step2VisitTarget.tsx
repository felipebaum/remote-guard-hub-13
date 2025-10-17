import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, User, Phone, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { VisitTargetData } from "../QueueWizard";

interface Step2VisitTargetProps {
  data: VisitTargetData;
  onUpdate: (data: Partial<VisitTargetData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isValid: boolean;
}

const MOCK_BUILDINGS = [
  "Residencial Vista Bela",
  "Condomínio Solar", 
  "Edifício Central Plaza",
  "Residencial Jardim das Flores",
  "Condomínio Primavera",
  "Torre dos Ventos",
  "Residencial Parque das Águas",
  "Edifício Horizonte"
];

const RELATIONSHIPS = [
  "Familiar",
  "Amigo",
  "Colega de trabalho",
  "Prestador de serviço",
  "Cliente",
  "Outro"
];

export default function Step2VisitTarget({ data, onUpdate, onNext, onPrev, isValid }: Step2VisitTargetProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchResults, setSearchResults] = useState<Array<{name: string, apartment: string, phone: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case "residentName":
        if (!value.trim()) {
          newErrors.residentName = "Nome do morador é obrigatório";
        } else if (value.trim().length < 2) {
          newErrors.residentName = "Nome deve ter pelo menos 2 caracteres";
        } else {
          delete newErrors.residentName;
        }
        break;
      case "apartment":
        if (!value.trim()) {
          newErrors.apartment = "Apartamento é obrigatório";
        } else {
          delete newErrors.apartment;
        }
        break;
      case "building":
        if (!value.trim()) {
          newErrors.building = "Prédio é obrigatório";
        } else {
          delete newErrors.building;
        }
        break;
      case "phone":
        if (value && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) {
          newErrors.phone = "Formato inválido. Use (11) 99999-9999";
        } else {
          delete newErrors.phone;
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

  const handleInputChange = (field: keyof VisitTargetData, value: string) => {
    let formattedValue = value;
    
    if (field === "phone") {
      formattedValue = formatPhone(value);
    }
    
    onUpdate({ [field]: formattedValue });
    validateField(field, formattedValue);
  };

  const handleSearchResident = () => {
    if (!data.building || !data.apartment) {
      return;
    }

    setIsSearching(true);
    
    // Simular busca na base de dados
    setTimeout(() => {
      const mockResults = [
        {
          name: "João Silva",
          apartment: data.apartment,
          phone: "(11) 99999-9999"
        },
        {
          name: "Maria Santos",
          apartment: data.apartment,
          phone: "(11) 88888-8888"
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleSelectResident = (resident: {name: string, apartment: string, phone: string}) => {
    onUpdate({
      residentName: resident.name,
      apartment: resident.apartment,
      phone: resident.phone
    });
    setSearchResults([]);
  };

  const handleNext = () => {
    // Validar todos os campos obrigatórios
    const requiredFields = ["residentName", "apartment", "building"];
    const hasErrors = requiredFields.some(field => errors[field] || !data[field as keyof VisitTargetData]);
    
    if (!hasErrors) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Dados do Visitado
        </h2>
        <p className="text-gray-600">
          Informe quem será visitado no condomínio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prédio */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Prédio *
              </Label>
              <Select 
                value={data.building} 
                onValueChange={(value) => handleInputChange("building", value)}
              >
                <SelectTrigger className={errors.building ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o prédio" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_BUILDINGS.map((building) => (
                    <SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.building && (
                <p className="text-sm text-red-500">{errors.building}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Apartamento */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="apartment" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Apartamento *
              </Label>
              <Input
                id="apartment"
                value={data.apartment}
                onChange={(e) => handleInputChange("apartment", e.target.value)}
                placeholder="Ex: 101, 202A, 301B"
                className={errors.apartment ? "border-red-500" : ""}
              />
              {errors.apartment && (
                <p className="text-sm text-red-500">{errors.apartment}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca de Morador */}
      {data.building && data.apartment && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Buscar Morador</h3>
              </div>
              <p className="text-sm text-blue-700">
                Clique em "Buscar" para encontrar o morador no apartamento {data.apartment}
              </p>
              <Button
                onClick={handleSearchResident}
                disabled={isSearching}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {isSearching ? "Buscando..." : "Buscar Morador"}
              </Button>
              
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-900">Resultados encontrados:</p>
                  {searchResults.map((resident, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => handleSelectResident(resident)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{resident.name}</p>
                          <p className="text-sm text-gray-600">Apto {resident.apartment}</p>
                        </div>
                        <p className="text-sm text-gray-600">{resident.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dados do Morador */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome do Morador */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="residentName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome do Morador *
              </Label>
              <Input
                id="residentName"
                value={data.residentName}
                onChange={(e) => handleInputChange("residentName", e.target.value)}
                placeholder="Digite o nome completo"
                className={errors.residentName ? "border-red-500" : ""}
              />
              {errors.residentName && (
                <p className="text-sm text-red-500">{errors.residentName}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Telefone do Morador */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone do Morador (opcional)
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
      </div>

      {/* Relacionamento */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Relacionamento com o Visitante
            </Label>
            <Select 
              value={data.relationship} 
              onValueChange={(value) => handleInputChange("relationship", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o relacionamento" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIPS.map((relationship) => (
                  <SelectItem key={relationship} value={relationship}>
                    {relationship}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-green-900 mb-3">Resumo dos Dados do Visitado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Prédio:</span> {data.building || "Não informado"}
            </div>
            <div>
              <span className="font-medium">Apartamento:</span> {data.apartment || "Não informado"}
            </div>
            <div>
              <span className="font-medium">Nome:</span> {data.residentName || "Não informado"}
            </div>
            <div>
              <span className="font-medium">Telefone:</span> {data.phone || "Não informado"}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Relacionamento:</span> {data.relationship || "Não informado"}
            </div>
          </div>
        </CardContent>
      </Card>

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
