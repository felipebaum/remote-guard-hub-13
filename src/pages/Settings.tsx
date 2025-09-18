import { useState } from "react";
import { Save, Server, Phone, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const [sipSettings, setSipSettings] = useState({
    serverUrl: "sip.defenseaccess.com",
    port: "5060",
    domain: "defenseaccess.com",
    enableTLS: true,
    timeout: "30"
  });

  const [systemSettings, setSystemSettings] = useState({
    enableNotifications: true,
    enableAudioAlerts: true,
    sessionTimeout: "60",
    maxConcurrentSessions: "100",
    enableLogging: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: false,
    sessionExpiry: "24",
    passwordComplexity: true,
    enableAuditLog: true,
    ipWhitelist: ""
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "Todas as configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações</h2>
          <p className="text-muted-foreground">
            Configure o sistema, SIP e segurança
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="sip" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sip">SIP</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="sip">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <CardTitle>Configurações SIP</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serverUrl">Servidor SIP</Label>
                  <Input
                    id="serverUrl"
                    value={sipSettings.serverUrl}
                    onChange={(e) => setSipSettings({...sipSettings, serverUrl: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="port">Porta</Label>
                  <Input
                    id="port"
                    value={sipSettings.port}
                    onChange={(e) => setSipSettings({...sipSettings, port: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="domain">Domínio</Label>
                  <Input
                    id="domain"
                    value={sipSettings.domain}
                    onChange={(e) => setSipSettings({...sipSettings, domain: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="timeout">Timeout (segundos)</Label>
                  <Input
                    id="timeout"
                    value={sipSettings.timeout}
                    onChange={(e) => setSipSettings({...sipSettings, timeout: e.target.value})}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableTLS">Habilitar TLS</Label>
                  <p className="text-sm text-muted-foreground">Usa conexão segura para SIP</p>
                </div>
                <Switch
                  id="enableTLS"
                  checked={sipSettings.enableTLS}
                  onCheckedChange={(checked) => setSipSettings({...sipSettings, enableTLS: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                <CardTitle>Configurações do Sistema</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxSessions">Máximo de Sessões Simultâneas</Label>
                  <Input
                    id="maxSessions"
                    value={systemSettings.maxConcurrentSessions}
                    onChange={(e) => setSystemSettings({...systemSettings, maxConcurrentSessions: e.target.value})}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Habilitar Log do Sistema</Label>
                    <p className="text-sm text-muted-foreground">Registra atividades do sistema</p>
                  </div>
                  <Switch
                    checked={systemSettings.enableLogging}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableLogging: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertas Sonoros</Label>
                    <p className="text-sm text-muted-foreground">Reproduz sons para alertas</p>
                  </div>
                  <Switch
                    checked={systemSettings.enableAudioAlerts}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableAudioAlerts: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Configurações de Segurança</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionExpiry">Expiração de Sessão (horas)</Label>
                  <Input
                    id="sessionExpiry"
                    value={securitySettings.sessionExpiry}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionExpiry: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ipWhitelist">Lista de IPs Permitidos</Label>
                  <Input
                    id="ipWhitelist"
                    placeholder="192.168.1.1, 10.0.0.1"
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => setSecuritySettings({...securitySettings, ipWhitelist: e.target.value})}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Requer 2FA para todos os usuários</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireTwoFactor}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireTwoFactor: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Complexidade de Senha</Label>
                    <p className="text-sm text-muted-foreground">Exige senhas complexas</p>
                  </div>
                  <Switch
                    checked={securitySettings.passwordComplexity}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, passwordComplexity: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Log de Auditoria</Label>
                    <p className="text-sm text-muted-foreground">Registra todas as ações dos usuários</p>
                  </div>
                  <Switch
                    checked={securitySettings.enableAuditLog}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableAuditLog: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Configurações de Notificações</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações do Sistema</Label>
                  <p className="text-sm text-muted-foreground">Recebe notificações de eventos importantes</p>
                </div>
                <Switch
                  checked={systemSettings.enableNotifications}
                  onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableNotifications: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Tipos de Notificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usuário conectou</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usuário desconectou</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Problemas de conexão</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tentativas de acesso negado</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Atualizações do sistema</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}