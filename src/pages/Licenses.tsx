import { useState } from "react";
import { Plus, Copy, RefreshCw, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const mockLicenses = [
  {
    id: "lic1",
    name: "Licença Residencial Vista Bela",
    hash: "def456789abcdef123456789abcdef12",
    type: "Condomínio",
    target: "Residencial Vista Bela",
    status: "active",
    expiresAt: "2024-12-31",
    createdAt: "2024-01-15",
    maxUsers: 50,
    currentUsers: 9
  },
  {
    id: "lic2", 
    name: "Licença Condomínio Solar",
    hash: "abc123456def789abc123456def78901",
    type: "Condomínio",
    target: "Condomínio Solar",
    status: "active",
    expiresAt: "2024-11-30",
    createdAt: "2024-02-01",
    maxUsers: 20,
    currentUsers: 4
  },
  {
    id: "lic3",
    name: "Licença Teste",
    hash: "xyz987654321abc987654321abc98765",
    type: "Teste",
    target: "Ambiente de Teste",
    status: "expired",
    expiresAt: "2024-03-15",
    createdAt: "2024-01-01",
    maxUsers: 5,
    currentUsers: 0
  }
];

export default function Licenses() {
  const [licenses] = useState(mockLicenses);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [visibleHashes, setVisibleHashes] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggleHashVisibility = (licenseId: string) => {
    const newVisible = new Set(visibleHashes);
    if (newVisible.has(licenseId)) {
      newVisible.delete(licenseId);
    } else {
      newVisible.add(licenseId);
    }
    setVisibleHashes(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Licença copiada para a área de transferência",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Ativa";
      case "expired": return "Expirada";
      case "suspended": return "Suspensa";
      default: return status;
    }
  };

  const generateRandomHash = () => {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Licenças</h2>
          <p className="text-muted-foreground">
            Gerencie licenças e chaves de acesso do sistema
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Licença
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Licença</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="licenseName">Nome da Licença</Label>
                <Input id="licenseName" placeholder="Ex: Licença Grupo Centro" />
              </div>
              <div>
                <Label htmlFor="licenseType">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Condomínio">Condomínio</SelectItem>
                    <SelectItem value="Teste">Teste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxUsers">Máximo de Usuários</Label>
                <Input id="maxUsers" type="number" placeholder="50" />
              </div>
              <div>
                <Label htmlFor="expiresAt">Data de Expiração</Label>
                <Input id="expiresAt" type="date" />
              </div>
              <div>
                <Label>Hash da Licença</Label>
                <div className="flex gap-2">
                  <Input value={generateRandomHash()} readOnly />
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button className="w-full">Criar Licença</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {licenses.map((license) => (
          <Card key={license.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">{license.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{license.target}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(license.status)}>
                    {getStatusLabel(license.status)}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Hash da Licença</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={visibleHashes.has(license.id) ? license.hash : "•".repeat(32)}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleHashVisibility(license.id)}
                    >
                      {visibleHashes.has(license.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(license.hash)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <p className="font-medium">{license.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usuários:</span>
                    <p className="font-medium">{license.currentUsers}/{license.maxUsers}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Criada em:</span>
                    <p className="font-medium">{new Date(license.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expira em:</span>
                    <p className="font-medium">{new Date(license.expiresAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}