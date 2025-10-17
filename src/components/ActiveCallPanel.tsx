import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PhoneOff, 
  Video,
  Building,
  Users,
  Phone,
  X,
  Maximize2
} from "lucide-react";

interface Call {
  id: string;
  type: "elevator" | "main_gate" | "resident_call";
  callerName: string;
  callerInfo: string;
  building: string;
  apartment?: string;
  status: "waiting" | "active" | "on_hold" | "completed";
  startTime: Date;
  duration?: number;
  priority: "low" | "medium" | "high" | "critical";
  hasVideo?: boolean;
  callOrigin?: "intercom" | "reception" | "resident_phone";
  isOnCall?: boolean;
  callStartTime?: Date;
  isPaused?: boolean;
  cameras?: Array<{
    id: string;
    name: string;
    location: string;
    isActive: boolean;
    hasVideo: boolean;
  }>;
}

interface ActiveCallPanelProps {
  call: Call;
  onEndCall: () => void;
  onPauseCall: () => void;
  onResumeCall: () => void;
  onStartWizard: () => void;
  duration: number;
  isPaused: boolean;
  showWizard?: boolean;
  wizardComponent?: React.ReactNode;
}

export default function ActiveCallPanel({ 
  call, 
  onEndCall, 
  onPauseCall, 
  onResumeCall, 
  onStartWizard,
  duration,
  isPaused,
  showWizard = false,
  wizardComponent
}: ActiveCallPanelProps) {
  // Controles de áudio e vídeo removidos para otimizar espaço
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);

  const getCallOriginIcon = (origin?: string) => {
    switch (origin) {
      case "intercom":
        return <Building className="h-5 w-5" />;
      case "reception":
        return <Users className="h-5 w-5" />;
      case "resident_phone":
        return <Phone className="h-5 w-5" />;
      default:
        return <Phone className="h-5 w-5" />;
    }
  };

  const getCallOriginLabel = (origin?: string) => {
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

  const getCallOriginColor = (origin?: string) => {
    switch (origin) {
      case "intercom":
        return "text-blue-600";
      case "reception":
        return "text-green-600";
      case "resident_phone":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <Card className={`bg-white shadow-2xl ${isFullscreen ? 'w-full h-full max-w-none max-h-none' : 'w-full max-w-6xl max-h-[95vh] overflow-hidden'} flex flex-col`}>
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="flex-1 flex">
            {/* Painel Principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className={`text-white p-2 ${showWizard ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">
                        Chamada Ativa
                      </span>
                    </div>
                  <div className="flex items-center gap-1">
                    <span className={`${getCallOriginColor(call.callOrigin)}`}>
                      {getCallOriginIcon(call.callOrigin)}
                    </span>
                    <span className="text-blue-100 text-sm">
                      {getCallOriginLabel(call.callOrigin)}
                    </span>
                  </div>
                  <div className="text-lg font-mono">
                    {formatDuration(duration)}
                  </div>
                  
                  {/* Informações da Chamada no Cabeçalho */}
                  <div className="flex items-center gap-4 text-white text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Nome:</span>
                      <span className="text-blue-100">{call.callerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Info:</span>
                      <span className="text-blue-100">{call.callerInfo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Prédio:</span>
                      <span className="text-blue-100">{call.building}</span>
                    </div>
                    {call.apartment && call.apartment !== "Não identificado" && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Apto:</span>
                        <span className="text-blue-100">{call.apartment}</span>
                      </div>
                    )}
                  </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-blue-600 h-6 w-6 p-0"
                    >
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={onEndCall}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-red-600 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-1 flex">
                {/* Área de Vídeo/Imagem - Ocupa toda a largura */}
                <div className="w-full flex flex-col">
      {/* Layout de 1 Câmera - Para ligações do Interfone */}
      {call.cameras && call.cameras.length === 1 ? (
        <div className={`bg-gray-900 relative ${showWizard ? 'h-64' : 'h-80'} flex items-center justify-center`}>
          <div className="w-full h-full bg-gray-800 rounded relative">
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {call.cameras[0].name}
            </div>
            <div className="absolute top-2 right-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-white text-xs">REC</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 text-white text-xs">
              {call.cameras[0].location}
            </div>
            {/* Simulação de vídeo */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-24 w-24 mx-auto mb-3 opacity-50" />
                <p className="text-lg opacity-75">Câmera Ativa</p>
                <p className="text-sm opacity-50">{call.cameras[0].name}</p>
              </div>
            </div>
          </div>
        </div>
      ) : call.cameras && call.cameras.length >= 3 ? (
                    <div className={`bg-gray-900 relative ${showWizard ? 'h-64' : 'h-80'} p-1`}>
                      {/* Layout Quadrado - 2x2 */}
                      <div className="grid grid-cols-2 gap-1 h-full">
                        {/* Câmera 1 */}
                        <div className="bg-gray-800 rounded relative">
                          {call.cameras[0]?.hasVideo ? (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <div className="text-center">
                                <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">{call.cameras[0].name}</p>
                                <p className="text-xs opacity-75">{call.cameras[0].location}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <div className="text-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1">
                                  <span className="text-xs font-bold">
                                    {call.cameras[0]?.name.charAt(0)}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold">{call.cameras[0]?.name}</p>
                                <p className="text-xs opacity-75">{call.cameras[0]?.location}</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-1 left-1">
                            <Badge className="bg-green-600 text-white text-xs px-1 py-0">
                              Cam 1
                            </Badge>
                          </div>
                        </div>

                        {/* Câmera 2 */}
                        <div className="bg-gray-800 rounded relative">
                          {call.cameras[1]?.hasVideo ? (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <div className="text-center">
                                <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">{call.cameras[1].name}</p>
                                <p className="text-xs opacity-75">{call.cameras[1].location}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <div className="text-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1">
                                  <span className="text-xs font-bold">
                                    {call.cameras[1]?.name.charAt(0)}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold">{call.cameras[1]?.name}</p>
                                <p className="text-xs opacity-75">{call.cameras[1]?.location}</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-1 left-1">
                            <Badge className="bg-green-600 text-white text-xs px-1 py-0">
                              Cam 2
                            </Badge>
                          </div>
                        </div>

                        {/* Câmera 3 */}
                        <div className="bg-gray-800 rounded relative">
                          {call.cameras[2]?.hasVideo ? (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <div className="text-center">
                                <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">{call.cameras[2].name}</p>
                                <p className="text-xs opacity-75">{call.cameras[2].location}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <span className="text-lg font-bold">
                                    {call.cameras[2]?.name.charAt(0)}
                                  </span>
                                </div>
                                <p className="text-sm font-semibold">{call.cameras[2]?.name}</p>
                                <p className="text-xs opacity-75">{call.cameras[2]?.location}</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-1 left-1">
                            <Badge className="bg-green-600 text-white text-xs px-1 py-0">
                              Cam 3
                            </Badge>
                          </div>
                        </div>

                        {/* Câmera 4 */}
                        <div className="bg-gray-800 rounded relative">
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <div className="text-center">
                              <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Área de Espera</p>
                              <p className="text-xs opacity-75">Recepção</p>
                            </div>
                          </div>
                          <div className="absolute top-1 left-1">
                            <Badge className="bg-green-600 text-white text-xs px-1 py-0">
                              Cam 4
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`bg-gray-900 flex items-center justify-center relative ${showWizard ? 'h-64' : 'h-80'}`}>
          {/* Para ligações de Morador, Elevador e Interfone - Sem câmeras */}
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              {call.callOrigin === "reception" ? (
                <Users className="h-12 w-12 text-white" />
              ) : call.callOrigin === "resident_phone" ? (
                <Phone className="h-12 w-12 text-white" />
              ) : (
                <Building className="h-12 w-12 text-white" />
              )}
            </div>
            <p className="text-xl font-semibold">{call.callerName}</p>
            <p className="text-blue-300 text-xs">
              {getCallOriginLabel(call.callOrigin)} - {call.building}
            </p>
            <p className="text-xs opacity-75 mt-1">
              {call.apartment && call.apartment !== "Não identificado" && `Apto ${call.apartment}`}
              {call.apartment === "Não identificado" && "Aguardando identificação"}
            </p>
            <div className="mt-2 p-2 bg-blue-800 bg-opacity-50 rounded-lg">
              <p className="text-xs">
                {call.callOrigin === "intercom" && "Visitante no interfone aguardando"}
                {call.callOrigin === "resident_phone" && "Chamada direta do morador"}
                {call.callOrigin === "reception" && "Visitante aguardando na portaria"}
              </p>
            </div>
          </div>
                    </div>
                  )}

                  {/* Controles de Chamada */}
                  {!showWizard && (
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          onClick={onStartWizard}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                          size="lg"
                        >
                          <Users className="h-5 w-5" />
                          Iniciar Wizard
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Área do Wizard - Abaixo da Câmera */}
          {showWizard && (
            <div className="border-t bg-gray-50">
              <div className="h-[28rem] overflow-hidden">
                {wizardComponent && React.cloneElement(wizardComponent as React.ReactElement, { onEndCall: onEndCall })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
