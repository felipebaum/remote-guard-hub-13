import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  FileText, 
  CreditCard, 
  Car, 
  Camera,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Home,
  Shield,
  PhoneOff
} from "lucide-react";
import { WizardData } from "./QueueWizard";

const STEPS = [
  { id: 1, title: "Visitante", icon: User },
  { id: 2, title: "Visitado", icon: Home },
  { id: 3, title: "Autorização", icon: Phone },
  { id: 4, title: "Documentos", icon: FileText },
  { id: 5, title: "Liberação", icon: Shield }
];

interface CompactWizardProps {
  onComplete: (data: WizardData) => void;
  onCancel: () => void;
  onEndCall?: () => void;
}

export default function CompactWizard({ onComplete, onCancel, onEndCall }: CompactWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [visitorSearchTerm, setVisitorSearchTerm] = useState("");
  const [visitorSearchResults, setVisitorSearchResults] = useState<any[]>([]);
  const [isSearchingVisitor, setIsSearchingVisitor] = useState(false);
  const [wizardData, setWizardData] = useState({
    visitor: { name: "", phone: "", email: "", company: "", visitPurpose: "" },
    target: { residentName: "", apartment: "", building: "", phone: "", relationship: "" },
    authorization: { status: "pending", contactAttempts: 0, callOrigin: "intercom" },
    documents: { cpf: "", rg: "", carPlate: "", carModel: "", carColor: "" },
    access: { accessType: "temporary", restrictions: "", notes: "" }
  });

  const updateData = (section: string, data: any) => {
    setWizardData(prev => ({ ...prev, [section]: { ...prev[section as keyof typeof prev], ...data } }));
  };

  // Mock data para busca de moradores
  const mockResidents = [
    { id: 1, name: "João Silva", apartment: "101", building: "Residencial Vista Bela", phone: "(11) 99999-9999" },
    { id: 2, name: "Maria Santos", apartment: "205", building: "Condomínio Solar", phone: "(11) 88888-8888" },
    { id: 3, name: "Pedro Costa", apartment: "301", building: "Edifício Central Plaza", phone: "(11) 77777-7777" },
    { id: 4, name: "Ana Oliveira", apartment: "102", building: "Residencial Vista Bela", phone: "(11) 66666-6666" },
    { id: 5, name: "Carlos Mendes", apartment: "304", building: "Condomínio Solar", phone: "(11) 55555-5555" },
    { id: 6, name: "Fernanda Alves", apartment: "202", building: "Edifício Central Plaza", phone: "(11) 44444-4444" },
    { id: 7, name: "Roberto Lima", apartment: "103", building: "Residencial Vista Bela", phone: "(11) 33333-3333" },
    { id: 8, name: "Lucia Costa", apartment: "306", building: "Condomínio Solar", phone: "(11) 22222-2222" }
  ];

  // Mock data para busca de visitantes
  const mockVisitors = [
    { id: 1, name: "Carlos Mendes", phone: "(11) 99999-1111", email: "carlos@email.com", company: "Tech Solutions", visitPurpose: "Reunião", cpf: "123.456.789-00" },
    { id: 2, name: "Ana Beatriz", phone: "(11) 88888-2222", email: "ana@email.com", company: "Design Studio", visitPurpose: "Entrega", cpf: "987.654.321-00" },
    { id: 3, name: "Roberto Silva", phone: "(11) 77777-3333", email: "roberto@email.com", company: "Consultoria ABC", visitPurpose: "Visita", cpf: "456.789.123-00" },
    { id: 4, name: "Fernanda Costa", phone: "(11) 66666-4444", email: "fernanda@email.com", company: "Freelancer", visitPurpose: "Prestação de Serviços", cpf: "789.123.456-00" },
    { id: 5, name: "Lucas Oliveira", phone: "(11) 55555-5555", email: "lucas@email.com", company: "Empresa XYZ", visitPurpose: "Reunião", cpf: "321.654.987-00" },
    { id: 6, name: "Mariana Santos", phone: "(11) 44444-6666", email: "mariana@email.com", company: "Startup Tech", visitPurpose: "Entrega", cpf: "654.321.789-00" },
    { id: 7, name: "Pedro Lima", phone: "(11) 33333-7777", email: "pedro@email.com", company: "Consultoria Digital", visitPurpose: "Visita", cpf: "147.258.369-00" },
    { id: 8, name: "Juliana Alves", phone: "(11) 22222-8888", email: "juliana@email.com", company: "Agência Criativa", visitPurpose: "Prestação de Serviços", cpf: "369.258.147-00" }
  ];

  const searchResidents = (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simular busca com delay
    setTimeout(() => {
      const results = mockResidents.filter(resident => 
        resident.name.toLowerCase().includes(term.toLowerCase()) ||
        resident.apartment.includes(term) ||
        resident.building.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const selectResident = (resident: any) => {
    updateData("target", {
      residentName: resident.name,
      apartment: resident.apartment,
      building: resident.building,
      phone: resident.phone
    });
    setSearchTerm("");
    setSearchResults([]);
  };

  const searchVisitors = (term: string) => {
    if (term.length < 2) {
      setVisitorSearchResults([]);
      return;
    }

    setIsSearchingVisitor(true);
    
    // Simular busca com delay
    setTimeout(() => {
      const results = mockVisitors.filter(visitor => 
        visitor.name.toLowerCase().includes(term.toLowerCase()) ||
        visitor.phone.includes(term) ||
        visitor.company.toLowerCase().includes(term.toLowerCase()) ||
        visitor.cpf.includes(term)
      );
      setVisitorSearchResults(results);
      setIsSearchingVisitor(false);
    }, 500);
  };

  const selectVisitor = (visitor: any) => {
    updateData("visitor", {
      name: visitor.name,
      phone: visitor.phone,
      email: visitor.email,
      company: visitor.company,
      visitPurpose: visitor.visitPurpose
    });
    updateData("documents", {
      cpf: visitor.cpf
    });
    setVisitorSearchTerm("");
    setVisitorSearchResults([]);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Busca de Visitante */}
            <div className="relative">
              <Label htmlFor="visitorSearch">Buscar Visitante</Label>
              <div className="relative">
                <Input
                  id="visitorSearch"
                  value={visitorSearchTerm}
                  onChange={(e) => {
                    setVisitorSearchTerm(e.target.value);
                    searchVisitors(e.target.value);
                  }}
                  placeholder="Digite nome, telefone, empresa ou CPF..."
                  className="pr-10"
                />
                {isSearchingVisitor && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {/* Resultados da Busca */}
              {visitorSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {visitorSearchResults.map((visitor) => (
                    <div
                      key={visitor.id}
                      onClick={() => selectVisitor(visitor)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{visitor.name}</p>
                          <p className="text-sm text-gray-600">{visitor.company}</p>
                          <p className="text-xs text-gray-500">{visitor.phone}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs mb-1">Visitante</Badge>
                          <p className="text-xs text-gray-500">{visitor.visitPurpose}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campos do Visitante */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={wizardData.visitor.name}
                  onChange={(e) => updateData("visitor", { name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={wizardData.visitor.phone}
                  onChange={(e) => updateData("visitor", { phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={wizardData.visitor.email}
                  onChange={(e) => updateData("visitor", { email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={wizardData.visitor.company}
                  onChange={(e) => updateData("visitor", { company: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="purpose">Motivo da Visita</Label>
              <Select value={wizardData.visitor.visitPurpose} onValueChange={(value) => updateData("visitor", { visitPurpose: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entrega">Entrega</SelectItem>
                  <SelectItem value="Visita social">Visita social</SelectItem>
                  <SelectItem value="Serviço técnico">Serviço técnico</SelectItem>
                  <SelectItem value="Reunião de negócios">Reunião de negócios</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visitante Selecionado */}
            {wizardData.visitor.name && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Visitante Selecionado:</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {wizardData.visitor.name} - {wizardData.visitor.company}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {wizardData.visitor.phone} • {wizardData.visitor.visitPurpose}
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Busca de Morador */}
            <div className="relative">
              <Label htmlFor="search">Buscar Morador</Label>
              <div className="relative">
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchResidents(e.target.value);
                  }}
                  placeholder="Digite nome, apartamento ou prédio..."
                  className="pr-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {/* Resultados da Busca */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((resident) => (
                    <div
                      key={resident.id}
                      onClick={() => selectResident(resident)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{resident.name}</p>
                          <p className="text-sm text-gray-600">Apto {resident.apartment} - {resident.building}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{resident.phone}</p>
                          <Badge variant="secondary" className="text-xs">Morador</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campos do Morador */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resident">Morador</Label>
                <Input
                  id="resident"
                  value={wizardData.target.residentName}
                  onChange={(e) => updateData("target", { residentName: e.target.value })}
                  placeholder="Nome do morador"
                />
              </div>
              <div>
                <Label htmlFor="apartment">Apartamento</Label>
                <Input
                  id="apartment"
                  value={wizardData.target.apartment}
                  onChange={(e) => updateData("target", { apartment: e.target.value })}
                  placeholder="Ex: 101"
                />
              </div>
              <div>
                <Label htmlFor="building">Prédio</Label>
                <Input
                  id="building"
                  value={wizardData.target.building}
                  onChange={(e) => updateData("target", { building: e.target.value })}
                  placeholder="Nome do prédio"
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relacionamento</Label>
                <Select value={wizardData.target.relationship} onValueChange={(value) => updateData("target", { relationship: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Familiar">Familiar</SelectItem>
                    <SelectItem value="Amigo">Amigo</SelectItem>
                    <SelectItem value="Colega">Colega</SelectItem>
                    <SelectItem value="Prestador">Prestador</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Morador Selecionado */}
            {wizardData.target.residentName && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Morador Selecionado:</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  {wizardData.target.residentName} - Apto {wizardData.target.apartment} - {wizardData.target.building}
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div
                onClick={() => updateData("authorization", { callOrigin: "intercom" })}
                className={`p-3 border-2 rounded cursor-pointer ${
                  wizardData.authorization.callOrigin === "intercom" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="text-center">
                  <Building className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Interfone</p>
                </div>
              </div>
              <div
                onClick={() => updateData("authorization", { callOrigin: "reception" })}
                className={`p-3 border-2 rounded cursor-pointer ${
                  wizardData.authorization.callOrigin === "reception" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="text-center">
                  <User className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Portaria</p>
                </div>
              </div>
              <div
                onClick={() => updateData("authorization", { callOrigin: "resident_phone" })}
                className={`p-3 border-2 rounded cursor-pointer ${
                  wizardData.authorization.callOrigin === "resident_phone" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="text-center">
                  <Phone className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Telefone</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => updateData("authorization", { status: "approved" })}
                className="flex-1"
                variant={wizardData.authorization.status === "approved" ? "default" : "outline"}
              >
                Autorizado
              </Button>
              <Button
                onClick={() => updateData("authorization", { status: "rejected" })}
                className="flex-1"
                variant={wizardData.authorization.status === "rejected" ? "destructive" : "outline"}
              >
                Negado
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={wizardData.documents.cpf}
                onChange={(e) => updateData("documents", { cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={wizardData.documents.rg}
                onChange={(e) => updateData("documents", { rg: e.target.value })}
                placeholder="Número do RG"
              />
            </div>
            <div>
              <Label htmlFor="plate">Placa</Label>
              <Input
                id="plate"
                value={wizardData.documents.carPlate}
                onChange={(e) => updateData("documents", { carPlate: e.target.value })}
                placeholder="ABC1234"
              />
            </div>
            <div>
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={wizardData.documents.carModel}
                onChange={(e) => updateData("documents", { carModel: e.target.value })}
                placeholder="Honda Civic"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accessType">Tipo de Acesso</Label>
                <Select value={wizardData.access.accessType} onValueChange={(value) => updateData("access", { accessType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temporary">Temporário</SelectItem>
                    <SelectItem value="permanent">Permanente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="validUntil">Válido até</Label>
                <Input
                  id="validUntil"
                  type="datetime-local"
                  onChange={(e) => updateData("access", { validUntil: new Date(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={wizardData.access.notes}
                onChange={(e) => updateData("access", { notes: e.target.value })}
                placeholder="Observações finais..."
                rows={2}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="p-3 space-y-2 flex-shrink-0">
        <div className="flex items-center justify-between text-xs">
          <span>Passo {currentStep} de {STEPS.length}</span>
          <span>{Math.round((currentStep / STEPS.length) * 100)}%</span>
        </div>
        <Progress value={(currentStep / STEPS.length) * 100} className="h-1" />
        <div className="flex justify-center gap-1">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-1 px-1 py-0.5 rounded text-xs ${
                  step.id === currentStep
                    ? "bg-blue-100 text-blue-800"
                    : step.id < currentStep
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Icon className="h-3 w-3" />
                {step.title}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <Card>
          <CardContent className="pt-3">
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-between flex-shrink-0">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button variant="outline" size="sm" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
          )}
          {currentStep < STEPS.length ? (
            <Button size="sm" onClick={nextStep}>
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={() => onComplete(wizardData)} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-1" />
              Finalizar Wizard
            </Button>
          )}
          {onEndCall && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onEndCall}
              className="flex items-center gap-1"
            >
              <PhoneOff className="h-4 w-4" />
              Finalizar Chamada
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
