import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/ui/navigation";
import Dashboard from "./Dashboard";
import Integrators from "./Integrators";
import Users from "./Users";
import Licenses from "./Licenses";
import AccessGroups from "./AccessGroups";
import Settings from "./Settings";
import BuildingDetails from "./BuildingDetails";

const Index = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const buildingId = urlParams.get('building');
    if (buildingId) {
      setSelectedBuilding(buildingId);
    }
  }, []);

  const handleBackFromBuilding = () => {
    setSelectedBuilding(null);
    window.history.pushState({}, '', '/');
  };

  const renderContent = () => {
    if (selectedBuilding) {
      return <BuildingDetails buildingId={selectedBuilding} onBack={handleBackFromBuilding} />;
    }

    switch (activeItem) {
      case "dashboard":
        return <Dashboard />;
      case "integradores":
        return <Integrators />;
      case "grupos-acesso":
        return <AccessGroups />;
      case "usuarios":
        return <Users />;
      case "licencas":
        return <Licenses />;
      case "configuracoes":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <aside className="w-64 bg-card border-r min-h-[calc(100vh-80px)]">
          <div className="p-6">
            <Navigation 
              activeItem={activeItem} 
              onItemClick={setActiveItem} 
            />
          </div>
        </aside>
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
