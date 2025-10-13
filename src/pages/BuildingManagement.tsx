import { useState } from "react";
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Phone, 
  Mail,
  Search,
  Filter,
  Upload,
  Download,
  Home,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Tipos de dados
interface Building {
  id: string;
  name: string;
  address: string;
  blocks: Block[];
  totalApartments: number;
  totalResidents: number;
}

interface Block {
  id: string;
  name: string;
  floors: number;
  apartmentsPerFloor: number;
  buildingId: string;
  apartments: Apartment[];
}

interface Apartment {
  id: string;
  number: string;
  blockId: string;
  residents: Resident[];
}

interface Resident {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  cellphone: string;
  email: string;
  notes: string;
  status: 'active' | 'inactive';
  apartmentId: string;
}

// Mock data
const mockApartments: Apartment[] = [
  { 
    id: "1", 
    number: "A-101", 
    blockId: "1", 
    residents: [
      { id: "1", name: "João Silva", cpf: "123.456.789-00", phone: "1234", cellphone: "(11) 99999-9999", email: "joao@email.com", notes: "Sem entregas após 22h", status: "active", apartmentId: "1" },
      { id: "2", name: "Maria Silva", cpf: "123.456.789-01", phone: "1234", cellphone: "(11) 99999-9998", email: "maria.silva@email.com", notes: "Responsável pelo apartamento", status: "active", apartmentId: "1" }
    ]
  },
  { 
    id: "2", 
    number: "A-102", 
    blockId: "1", 
    residents: [
      { id: "3", name: "Maria Santos", cpf: "987.654.321-00", phone: "1235", cellphone: "(11) 88888-8888", email: "maria@email.com", notes: "", status: "active", apartmentId: "2" }
    ]
  },
  { 
    id: "3", 
    number: "A-103", 
    blockId: "1", 
    residents: [
      { id: "4", name: "Pedro Costa", cpf: "456.789.123-00", phone: "1236", cellphone: "(11) 77777-7777", email: "pedro@email.com", notes: "Trabalha de madrugada", status: "active", apartmentId: "3" },
      { id: "5", name: "Ana Costa", cpf: "456.789.123-01", phone: "1236", cellphone: "(11) 77777-7776", email: "ana.costa@email.com", notes: "", status: "active", apartmentId: "3" },
      { id: "6", name: "Carlos Costa", cpf: "456.789.123-02", phone: "1236", cellphone: "(11) 77777-7775", email: "carlos.costa@email.com", notes: "Filho - menor de idade", status: "active", apartmentId: "3" }
    ]
  },
  { id: "4", number: "A-201", blockId: "1", residents: [] },
  { id: "5", number: "A-202", blockId: "1", residents: [] },
  { id: "6", number: "A-301", blockId: "1", residents: [] },
  { 
    id: "7", 
    number: "B-101", 
    blockId: "2", 
    residents: [
      { id: "7", name: "Ana Oliveira", cpf: "789.123.456-00", phone: "2234", cellphone: "(11) 66666-6666", email: "ana@email.com", notes: "", status: "inactive", apartmentId: "7" }
    ]
  },
  { id: "8", number: "B-102", blockId: "2", residents: [] },
  { id: "9", number: "B-201", blockId: "2", residents: [] },
  { 
    id: "10", 
    number: "T1-101", 
    blockId: "3", 
    residents: [
      { id: "8", name: "Carlos Mendes", cpf: "321.654.987-00", phone: "3234", cellphone: "(11) 55555-5555", email: "carlos@email.com", notes: "Recebe entregas apenas manhã", status: "active", apartmentId: "10" },
      { id: "9", name: "Lucia Mendes", cpf: "321.654.987-01", phone: "3234", cellphone: "(11) 55555-5554", email: "lucia.mendes@email.com", notes: "", status: "active", apartmentId: "10" }
    ]
  },
  { id: "11", number: "T1-102", blockId: "3", residents: [] },
  { id: "12", number: "T2-101", blockId: "4", residents: [] },
  { id: "13", number: "T2-102", blockId: "4", residents: [] },
];

const mockBuildings: Building[] = [
  {
    id: "1",
    name: "Residencial Vista Bela",
    address: "Rua das Flores, 123",
    totalApartments: 120,
    totalResidents: 95,
    blocks: [
      {
        id: "1",
        name: "Bloco A",
        floors: 10,
        apartmentsPerFloor: 6,
        buildingId: "1",
        apartments: mockApartments.filter(apt => apt.blockId === "1")
      },
      {
        id: "2", 
        name: "Bloco B",
        floors: 8,
        apartmentsPerFloor: 8,
        buildingId: "1",
        apartments: mockApartments.filter(apt => apt.blockId === "2")
      }
    ]
  },
  {
    id: "2",
    name: "Condomínio Solar",
    address: "Av. Solar, 456",
    totalApartments: 80,
    totalResidents: 72,
    blocks: [
      {
        id: "3",
        name: "Torre 1",
        floors: 12,
        apartmentsPerFloor: 4,
        buildingId: "2",
        apartments: mockApartments.filter(apt => apt.blockId === "3")
      },
      {
        id: "4",
        name: "Torre 2", 
        floors: 12,
        apartmentsPerFloor: 4,
        buildingId: "2",
        apartments: mockApartments.filter(apt => apt.blockId === "4")
      }
    ]
  }
];

const BuildingManagement = () => {
  const [buildings, setBuildings] = useState<Building[]>(mockBuildings);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showApartmentModal, setShowApartmentModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'buildings' | 'blocks' | 'residents'>('buildings');

  // Estados para formulários
  const [buildingForm, setBuildingForm] = useState({
    name: "",
    address: ""
  });

  const [blockForm, setBlockForm] = useState({
    name: "",
    floors: 0,
    apartmentsPerFloor: 0
  });

  const [residentForm, setResidentForm] = useState({
    name: "",
    cpf: "",
    phone: "",
    cellphone: "",
    email: "",
    notes: "",
    status: "active" as 'active' | 'inactive'
  });

  // Estados para importação
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

  // Estados para expansão de cards
  const [expandedApartments, setExpandedApartments] = useState<Set<string>>(new Set());


  // Funções para gerenciar condomínios
  const handleAddBuilding = () => {
    setEditingBuilding(null);
    setBuildingForm({ name: "", address: "" });
    setShowBuildingModal(true);
  };

  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setBuildingForm({ name: building.name, address: building.address });
    setShowBuildingModal(true);
  };

  const handleSaveBuilding = () => {
    if (editingBuilding) {
      // Editar condomínio existente
      setBuildings(prev => prev.map(b => 
        b.id === editingBuilding.id 
          ? { ...b, name: buildingForm.name, address: buildingForm.address }
          : b
      ));
    } else {
      // Adicionar novo condomínio
      const newBuilding: Building = {
        id: Date.now().toString(),
        name: buildingForm.name,
        address: buildingForm.address,
        blocks: [],
        totalApartments: 0,
        totalResidents: 0
      };
      setBuildings(prev => [...prev, newBuilding]);
    }
    setShowBuildingModal(false);
  };

  // Funções para gerenciar blocos
  const handleAddBlock = (building: Building) => {
    setSelectedBuilding(building);
    setEditingBlock(null);
    setBlockForm({ name: "", floors: 0, apartmentsPerFloor: 0 });
    setShowBlockModal(true);
  };

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setBlockForm({ 
      name: block.name, 
      floors: block.floors, 
      apartmentsPerFloor: block.apartmentsPerFloor 
    });
    setShowBlockModal(true);
  };

  const handleSaveBlock = () => {
    if (!selectedBuilding) return;

    if (editingBlock) {
      // Editar bloco existente
      setBuildings(prev => prev.map(building => 
        building.id === selectedBuilding.id 
          ? {
              ...building,
              blocks: building.blocks.map(block =>
                block.id === editingBlock.id
                  ? { ...block, ...blockForm }
                  : block
              )
            }
          : building
      ));
    } else {
      // Adicionar novo bloco
      const newBlock: Block = {
        id: Date.now().toString(),
        ...blockForm,
        buildingId: selectedBuilding.id,
        apartments: generateApartments({
          id: Date.now().toString(),
          ...blockForm,
          buildingId: selectedBuilding.id,
          apartments: []
        }).map(apt => ({ ...apt, residents: [] }))
      };

      setBuildings(prev => prev.map(building =>
        building.id === selectedBuilding.id
          ? { ...building, blocks: [...building.blocks, newBlock] }
          : building
      ));
    }
    setShowBlockModal(false);
  };

  // Gerar apartamentos automaticamente
  const generateApartments = (block: Block) => {
    const apartments: Apartment[] = [];
    for (let floor = 1; floor <= block.floors; floor++) {
      for (let apt = 1; apt <= block.apartmentsPerFloor; apt++) {
        apartments.push({
          id: `${block.id}-${floor}-${apt}`,
          number: `${block.name.charAt(block.name.length - 1)}-${floor.toString().padStart(2, '0')}${apt}`,
          blockId: block.id,
          residents: []
        });
      }
    }
    return apartments;
  };

  // Funções para gerenciar moradores
  const handleAddResident = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setEditingResident(null);
    setResidentForm({
      name: "",
      cpf: "",
      phone: "",
      cellphone: "",
      email: "",
      notes: "",
      status: "active"
    });
    setShowResidentModal(true);
  };

  const handleEditResident = (resident: Resident) => {
    setEditingResident(resident);
    setResidentForm({
      name: resident.name,
      cpf: resident.cpf,
      phone: resident.phone,
      cellphone: resident.cellphone,
      email: resident.email,
      notes: resident.notes,
      status: resident.status
    });
    setShowResidentModal(true);
  };

  const handleSaveResident = () => {
    if (!selectedApartment) return;

    const newResident: Resident = {
      id: editingResident?.id || Date.now().toString(),
      ...residentForm,
      apartmentId: selectedApartment.id
    };

    // Atualizar apartamento com o morador
    if (selectedBlock) {
      setBuildings(prev => prev.map(building =>
        building.id === selectedBuilding?.id
          ? {
              ...building,
              blocks: building.blocks.map(block =>
                block.id === selectedBlock.id
                  ? {
                      ...block,
                      apartments: block.apartments.map(apt =>
                        apt.id === selectedApartment.id
                          ? {
                              ...apt,
                              residents: editingResident
                                ? apt.residents.map(res => res.id === editingResident.id ? newResident : res)
                                : [...apt.residents, newResident]
                            }
                          : apt
                      )
                    }
                  : block
              )
            }
          : building
      ));
    }

    setShowResidentModal(false);
  };

  const handleRemoveResident = (apartmentId: string, residentId: string) => {
    if (selectedBlock) {
      setBuildings(prev => prev.map(building =>
        building.id === selectedBuilding?.id
          ? {
              ...building,
              blocks: building.blocks.map(block =>
                block.id === selectedBlock.id
                  ? {
                      ...block,
                      apartments: block.apartments.map(apt =>
                        apt.id === apartmentId
                          ? { ...apt, residents: apt.residents.filter(res => res.id !== residentId) }
                          : apt
                      )
                    }
                  : block
              )
            }
          : building
      ));
    }
  };

  // Funções para importação
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportPreview([]);
      setImportErrors([]);
      setImportSuccess(false);
      parseFile(file);
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validar cabeçalhos esperados
      const expectedHeaders = ['apartamento', 'nome', 'cpf', 'telefone', 'celular', 'email', 'observacoes', 'status'];
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setImportErrors([`Cabeçalhos obrigatórios ausentes: ${missingHeaders.join(', ')}`]);
        return;
      }

      const preview = [];
      const errors = [];

      for (let i = 1; i < Math.min(lines.length, 11); i++) { // Preview das primeiras 10 linhas
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length && values.some(v => v)) {
          const row = {
            apartamento: values[headers.indexOf('apartamento')],
            nome: values[headers.indexOf('nome')],
            cpf: values[headers.indexOf('cpf')],
            telefone: values[headers.indexOf('telefone')],
            celular: values[headers.indexOf('celular')],
            email: values[headers.indexOf('email')],
            observacoes: values[headers.indexOf('observacoes')],
            status: values[headers.indexOf('status')] || 'ativo'
          };

          // Validações
          if (!row.apartamento) errors.push(`Linha ${i + 1}: Apartamento é obrigatório`);
          if (!row.nome) errors.push(`Linha ${i + 1}: Nome é obrigatório`);
          if (!row.cpf) errors.push(`Linha ${i + 1}: CPF é obrigatório`);
          if (row.status && !['ativo', 'inativo'].includes(row.status.toLowerCase())) {
            errors.push(`Linha ${i + 1}: Status deve ser 'ativo' ou 'inativo'`);
          }

          preview.push(row);
        }
      }

      setImportPreview(preview);
      setImportErrors(errors);
    };
    reader.readAsText(file);
  };

  const handleImportResidents = () => {
    if (!importFile || importErrors.length > 0 || !selectedBlock) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const importedResidents = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length && values.some(v => v)) {
          const row = {
            apartamento: values[headers.indexOf('apartamento')],
            nome: values[headers.indexOf('nome')],
            cpf: values[headers.indexOf('cpf')],
            telefone: values[headers.indexOf('telefone')],
            celular: values[headers.indexOf('celular')],
            email: values[headers.indexOf('email')],
            observacoes: values[headers.indexOf('observacoes')],
            status: values[headers.indexOf('status')] || 'ativo'
          };

          // Encontrar apartamento
          const apartment = selectedBlock.apartments.find(apt => 
            apt.number.toLowerCase() === row.apartamento.toLowerCase()
          );

          if (apartment) {
            const newResident: Resident = {
              id: Date.now().toString() + i,
              name: row.nome,
              cpf: row.cpf,
              phone: row.telefone,
              cellphone: row.celular,
              email: row.email,
              notes: row.observacoes,
              status: row.status.toLowerCase() === 'ativo' ? 'active' : 'inactive',
              apartmentId: apartment.id
            };

            // Atualizar apartamento adicionando o morador
            setBuildings(prev => prev.map(building =>
              building.id === selectedBuilding?.id
                ? {
                    ...building,
                    blocks: building.blocks.map(block =>
                      block.id === selectedBlock.id
                        ? {
                            ...block,
                            apartments: block.apartments.map(apt =>
                              apt.id === apartment.id
                                ? { ...apt, residents: [...apt.residents, newResident] }
                                : apt
                            )
                          }
                        : block
                    )
                  }
                : building
            ));

            successCount++;
          } else {
            errorCount++;
          }
        }
      }

      setImportSuccess(true);
      setTimeout(() => {
        setShowImportModal(false);
        setImportFile(null);
        setImportPreview([]);
        setImportErrors([]);
        setImportSuccess(false);
      }, 2000);
    };
    reader.readAsText(importFile);
  };

  const downloadTemplate = () => {
    const headers = ['Apartamento', 'Nome', 'CPF', 'Telefone', 'Celular', 'Email', 'Observacoes', 'Status'];
    const sampleData = [
      ['A-101', 'João Silva', '123.456.789-00', '1234', '(11) 99999-9999', 'joao@email.com', 'Sem entregas após 22h', 'ativo'],
      ['A-102', 'Maria Santos', '987.654.321-00', '1235', '(11) 88888-8888', 'maria@email.com', '', 'ativo'],
      ['A-103', 'Pedro Costa', '456.789.123-00', '1236', '(11) 77777-7777', 'pedro@email.com', 'Trabalha de madrugada', 'inativo']
    ];
    
    const csvContent = [headers, ...sampleData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_moradores.csv';
    link.click();
  };

  // Funções para gerenciar apartamentos
  const handleEditApartment = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setShowApartmentModal(true);
  };

  const handleDeleteApartment = (apartmentId: string) => {
    if (selectedBlock && confirm('Tem certeza que deseja excluir este apartamento e todos os seus moradores?')) {
      setBuildings(prev => prev.map(building =>
        building.id === selectedBuilding?.id
          ? {
              ...building,
              blocks: building.blocks.map(block =>
                block.id === selectedBlock.id
                  ? {
                      ...block,
                      apartments: block.apartments.filter(apt => apt.id !== apartmentId)
                    }
                  : block
              )
            }
          : building
      ));
    }
  };

  // Funções para gerenciar expansão de cards
  const toggleApartmentExpansion = (apartmentId: string) => {
    setExpandedApartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(apartmentId)) {
        newSet.delete(apartmentId);
      } else {
        newSet.add(apartmentId);
      }
      return newSet;
    });
  };

  const isApartmentExpanded = (apartmentId: string) => {
    return expandedApartments.has(apartmentId);
  };

  // Filtrar dados
  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlocks = selectedBuilding?.blocks.filter(block =>
    block.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredApartments = selectedBlock?.apartments.filter(apartment =>
    apartment.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apartment.residents.some(resident => resident.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Condomínios</h2>
          <p className="text-muted-foreground">
            Cadastre blocos, apartamentos e moradores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAddBuilding} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Condomínio
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar condomínios, blocos ou apartamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buildings">Condomínios</SelectItem>
            <SelectItem value="blocks">Blocos</SelectItem>
            <SelectItem value="residents">Moradores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Condomínios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBuildings.map((building) => (
          <Card key={building.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  {building.name}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditBuilding(building)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBuilding(building)}
                  >
                    <Building2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    {building.address}
                  </div>
                </div>
                
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    {building.blocks.length} bloco(s)
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4 text-gray-500" />
                    {building.totalApartments} apartamentos
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{building.totalResidents} moradores cadastrados</span>
                </div>

                <Separator />

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddBlock(building)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Bloco
                </Button>

                {building.blocks.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedBuilding(building)}
                  >
                    Gerenciar Blocos ({building.blocks.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Condomínio */}
      {showBuildingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingBuilding ? "Editar Condomínio" : "Novo Condomínio"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="buildingName">Nome do Condomínio</Label>
                <Input
                  id="buildingName"
                  value={buildingForm.name}
                  onChange={(e) => setBuildingForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Residencial Vista Bela"
                />
              </div>
              <div>
                <Label htmlFor="buildingAddress">Endereço</Label>
                <Input
                  id="buildingAddress"
                  value={buildingForm.address}
                  onChange={(e) => setBuildingForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Ex: Rua das Flores, 123"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveBuilding} className="flex-1">
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setShowBuildingModal(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Bloco */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingBlock ? "Editar Bloco" : "Novo Bloco"}
              </CardTitle>
              <p className="text-sm text-gray-600">
                Condomínio: {selectedBuilding?.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="blockName">Nome do Bloco</Label>
                <Input
                  id="blockName"
                  value={blockForm.name}
                  onChange={(e) => setBlockForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Bloco A, Torre 1"
                />
              </div>
              <div>
                <Label htmlFor="blockFloors">Número de Andares</Label>
                <Input
                  id="blockFloors"
                  type="number"
                  value={blockForm.floors}
                  onChange={(e) => setBlockForm(prev => ({ ...prev, floors: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 10"
                />
              </div>
              <div>
                <Label htmlFor="blockApartments">Apartamentos por Andar</Label>
                <Input
                  id="blockApartments"
                  type="number"
                  value={blockForm.apartmentsPerFloor}
                  onChange={(e) => setBlockForm(prev => ({ ...prev, apartmentsPerFloor: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 4"
                />
              </div>
              
              {blockForm.floors > 0 && blockForm.apartmentsPerFloor > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Serão gerados {blockForm.floors * blockForm.apartmentsPerFloor} apartamentos
                    (ex: {blockForm.name.charAt(blockForm.name.length - 1)}-101 a {blockForm.name.charAt(blockForm.name.length - 1)}-{blockForm.floors.toString().padStart(2, '0')}{blockForm.apartmentsPerFloor})
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSaveBlock} className="flex-1">
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setShowBlockModal(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Blocos (quando condomínio selecionado) */}
      {selectedBuilding && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Blocos - {selectedBuilding.name}
            </h3>
            <Button
              variant="outline"
              onClick={() => setSelectedBuilding(null)}
            >
              Voltar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBuilding.blocks.map((block) => (
              <Card key={block.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-green-600" />
                      {block.name}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBlock(block)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        {block.floors} andares
                      </div>
                      <div className="flex items-center gap-1">
                        <Home className="h-4 w-4 text-gray-500" />
                        {block.apartmentsPerFloor} apts/andar
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {block.floors * block.apartmentsPerFloor} apartamentos total
                      </span>
                    </div>

                    <Separator />

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedBlock(block)}
                    >
                      Gerenciar Apartamentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Apartamentos (quando bloco selecionado) */}
      {selectedBlock && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Apartamentos - {selectedBlock.name} ({selectedBuilding?.name})
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Template
              </Button>
              <Button
                variant="default"
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importar CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedBlock(null)}
              >
                Voltar aos Blocos
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedBuilding(null)}
              >
                Voltar aos Condomínios
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredApartments.map((apartment) => (
              <Card key={apartment.id} className={`hover:shadow-md transition-shadow ${apartment.residents.length > 0 ? 'border-green-200' : 'border-gray-200'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-blue-600" />
                      {apartment.number}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={apartment.residents.length > 0 ? "default" : "secondary"}>
                        {apartment.residents.length > 0 ? `${apartment.residents.length} morador(es)` : "Vazio"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleApartmentExpansion(apartment.id)}
                          className="h-6 w-6 p-0"
                          title={isApartmentExpanded(apartment.id) ? "Ocultar moradores" : "Expandir moradores"}
                        >
                          {isApartmentExpanded(apartment.id) ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditApartment(apartment)}
                          className="h-6 w-6 p-0"
                          title="Gerenciar Apartamento"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteApartment(apartment.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          title="Excluir Apartamento"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {apartment.residents.length > 0 ? (
                    <>
                      {/* Resumo dos moradores (sempre visível) */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Moradores:</span>
                          <div className="flex flex-wrap gap-1">
                            {apartment.residents.slice(0, 2).map((resident) => (
                              <Badge key={resident.id} variant="outline" className="text-xs">
                                {resident.name.split(' ')[0]}
                              </Badge>
                            ))}
                            {apartment.residents.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{apartment.residents.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Lista expandida de moradores */}
                      {isApartmentExpanded(apartment.id) && (
                        <div className="space-y-3 border-t pt-3">
                          {apartment.residents.map((resident, index) => (
                            <div key={resident.id} className={`space-y-2 ${index > 0 ? 'border-t pt-2' : ''}`}>
                              <div className="text-sm">
                                <div className="font-medium flex items-center justify-between">
                                  <span>{resident.name}</span>
                                  <Badge variant={resident.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                    {resident.status === 'active' ? 'Ativo' : 'Inativo'}
                                  </Badge>
                                </div>
                                <div className="text-gray-600 text-xs">{resident.cpf}</div>
                              </div>
                              
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {resident.phone} (interfone)
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {resident.cellphone}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {resident.email}
                                </div>
                              </div>

                              {resident.notes && (
                                <div className="text-xs text-orange-600 bg-orange-50 p-1 rounded">
                                  ⚠️ {resident.notes}
                                </div>
                              )}

                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditResident(resident)}
                                  className="flex-1 text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Editar
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveResident(apartment.id, resident.id)}
                                  className="text-xs text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          <div className="border-t pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleAddResident(apartment)}
                              className="w-full text-xs"
                              variant="outline"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Adicionar Morador
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Botão para expandir/ocultar quando não expandido */}
                      {!isApartmentExpanded(apartment.id) && (
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            onClick={() => handleAddResident(apartment)}
                            className="flex-1 text-xs"
                            variant="outline"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar Morador
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => toggleApartmentExpansion(apartment.id)}
                            className="text-xs"
                            variant="ghost"
                          >
                            Ver Todos
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-gray-400 text-sm mb-2">Apartamento vazio</div>
                      <Button
                        size="sm"
                        onClick={() => handleAddResident(apartment)}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Cadastrar Morador
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredApartments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum apartamento encontrado para este bloco.
            </div>
          )}
        </div>
      )}

      {/* Modal de Morador */}
      {showResidentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingResident ? "Editar Morador" : "Novo Morador"}
              </CardTitle>
              <p className="text-sm text-gray-600">
                Apartamento: {selectedApartment?.number} - {selectedBlock?.name}
                {selectedApartment?.residents.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    ({selectedApartment.residents.length} morador(es) cadastrado(s))
                  </span>
                )}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="residentName">Nome Completo</Label>
                  <Input
                    id="residentName"
                    value={residentForm.name}
                    onChange={(e) => setResidentForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="residentCPF">CPF</Label>
                  <Input
                    id="residentCPF"
                    value={residentForm.cpf}
                    onChange={(e) => setResidentForm(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="residentPhone">Telefone (Interfone)</Label>
                  <Input
                    id="residentPhone"
                    value={residentForm.phone}
                    onChange={(e) => setResidentForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Ex: 1234"
                  />
                </div>
                <div>
                  <Label htmlFor="residentCellphone">Celular</Label>
                  <Input
                    id="residentCellphone"
                    value={residentForm.cellphone}
                    onChange={(e) => setResidentForm(prev => ({ ...prev, cellphone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="residentEmail">Email</Label>
                <Input
                  id="residentEmail"
                  type="email"
                  value={residentForm.email}
                  onChange={(e) => setResidentForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="exemplo@email.com"
                />
              </div>

              <div>
                <Label htmlFor="residentNotes">Observações</Label>
                <Textarea
                  id="residentNotes"
                  value={residentForm.notes}
                  onChange={(e) => setResidentForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ex: Sem entregas após 22h, Trabalha de madrugada..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="residentStatus">Status</Label>
                <Select
                  value={residentForm.status}
                  onValueChange={(value: 'active' | 'inactive') => setResidentForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Ativo
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Inativo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveResident} className="flex-1">
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setShowResidentModal(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Importação */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Importar Moradores via CSV
              </CardTitle>
              <p className="text-sm text-gray-600">
                Bloco: {selectedBlock?.name} - {selectedBuilding?.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instruções */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Instruções:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Baixe o template CSV para ver o formato correto</li>
                  <li>• Preencha os dados dos moradores no arquivo</li>
                  <li>• A coluna "Apartamento" deve corresponder exatamente ao número do apartamento</li>
                  <li>• Campos obrigatórios: Apartamento, Nome, CPF</li>
                  <li>• Status deve ser "ativo" ou "inativo"</li>
                </ul>
              </div>

              {/* Upload de arquivo */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="importFile">Selecionar arquivo CSV</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="importFile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={downloadTemplate}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Template
                    </Button>
                  </div>
                </div>

                {/* Preview dos dados */}
                {importPreview.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Preview dos dados (primeiras 10 linhas):</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left">Apartamento</th>
                              <th className="px-3 py-2 text-left">Nome</th>
                              <th className="px-3 py-2 text-left">CPF</th>
                              <th className="px-3 py-2 text-left">Telefone</th>
                              <th className="px-3 py-2 text-left">Celular</th>
                              <th className="px-3 py-2 text-left">Email</th>
                              <th className="px-3 py-2 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {importPreview.map((row, index) => (
                              <tr key={index} className="border-t">
                                <td className="px-3 py-2">{row.apartamento}</td>
                                <td className="px-3 py-2">{row.nome}</td>
                                <td className="px-3 py-2">{row.cpf}</td>
                                <td className="px-3 py-2">{row.telefone}</td>
                                <td className="px-3 py-2">{row.celular}</td>
                                <td className="px-3 py-2">{row.email}</td>
                                <td className="px-3 py-2">
                                  <Badge variant={row.status.toLowerCase() === 'ativo' ? 'default' : 'secondary'}>
                                    {row.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Erros de validação */}
                {importErrors.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="font-semibold">Erros encontrados:</div>
                        {importErrors.map((error, index) => (
                          <div key={index} className="text-sm">• {error}</div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Sucesso */}
                {importSuccess && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold text-green-800">
                        Importação realizada com sucesso!
                      </div>
                      <div className="text-sm text-green-700">
                        Os moradores foram cadastrados nos apartamentos correspondentes.
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <Button
                  onClick={handleImportResidents}
                  disabled={!importFile || importErrors.length > 0}
                  className="flex-1"
                >
                  {importSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Importação Concluída
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Moradores
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportPreview([]);
                    setImportErrors([]);
                    setImportSuccess(false);
                  }}
                >
                  {importSuccess ? 'Fechar' : 'Cancelar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Gerenciamento de Apartamento */}
      {showApartmentModal && selectedApartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Gerenciar Apartamento - {selectedApartment.number}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {selectedBlock?.name} - {selectedBuilding?.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações do Apartamento */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Informações do Apartamento</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Número:</span>
                    <div className="font-medium">{selectedApartment.number}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Bloco:</span>
                    <div className="font-medium">{selectedBlock?.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Moradores:</span>
                    <div className="font-medium">{selectedApartment.residents.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className="font-medium">
                      <Badge variant={selectedApartment.residents.length > 0 ? "default" : "secondary"}>
                        {selectedApartment.residents.length > 0 ? "Ocupado" : "Vazio"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Moradores */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Moradores Cadastrados</h4>
                  <Button
                    onClick={() => {
                      setShowApartmentModal(false);
                      handleAddResident(selectedApartment);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Morador
                  </Button>
                </div>

                {selectedApartment.residents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedApartment.residents.map((resident) => (
                      <Card key={resident.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="font-semibold text-lg">{resident.name}</div>
                                <Badge variant={resident.status === 'active' ? 'default' : 'secondary'}>
                                  {resident.status === 'active' ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">CPF:</span>
                                  <div className="font-medium">{resident.cpf}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Email:</span>
                                  <div className="font-medium">{resident.email}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Interfone:</span>
                                  <div className="font-medium">{resident.phone}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Celular:</span>
                                  <div className="font-medium">{resident.cellphone}</div>
                                </div>
                              </div>

                              {resident.notes && (
                                <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                                  <span className="text-orange-800 font-medium">Observações:</span>
                                  <div className="text-orange-700">{resident.notes}</div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setShowApartmentModal(false);
                                  handleEditResident(resident);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja remover ${resident.name} deste apartamento?`)) {
                                    handleRemoveResident(selectedApartment.id, resident.id);
                                    setShowApartmentModal(false);
                                  }
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remover
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-500 font-medium mb-2">Nenhum morador cadastrado</div>
                    <div className="text-gray-400 text-sm mb-4">
                      Este apartamento está vazio. Clique no botão acima para adicionar o primeiro morador.
                    </div>
                    <Button
                      onClick={() => {
                        setShowApartmentModal(false);
                        handleAddResident(selectedApartment);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Cadastrar Primeiro Morador
                    </Button>
                  </div>
                )}
              </div>

              {/* Ações do Apartamento */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <strong>Atenção:</strong> A exclusão do apartamento removerá todos os moradores cadastrados.
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir o apartamento ${selectedApartment.number} e todos os seus moradores?`)) {
                          handleDeleteApartment(selectedApartment.id);
                          setShowApartmentModal(false);
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir Apartamento
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowApartmentModal(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BuildingManagement;
