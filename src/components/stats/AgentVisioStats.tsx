
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDossier } from "@/contexts/DossierContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Composants refactorisés
import StatsCards from "./StatsCards";
import RendezVousAgenda from "./RendezVousAgenda";
import RendezVousChart from "./RendezVousChart";
import RendezVousImminents from "./RendezVousImminents";
import RendezVousFormDialog from "./RendezVousFormDialog";
import DeleteRendezVousDialog from "./DeleteRendezVousDialog";

const AgentVisioStats: React.FC = () => {
  const { user } = useAuth();
  const { rendezVous, dossiers, addRendezVous, updateRendezVous, deleteRendezVous } = useDossier();
  const { toast } = useToast();
  
  // État local pour les modals
  const [isAddRdvOpen, setIsAddRdvOpen] = useState(false);
  const [isEditRdvOpen, setIsEditRdvOpen] = useState(false);
  const [isDeleteRdvOpen, setIsDeleteRdvOpen] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState<string | null>(null);
  
  // États pour le formulaire d'ajout/édition
  const [rdvForm, setRdvForm] = useState({
    date: "",
    time: "",
    dossierId: "",
    notes: "",
    honore: true,
    meetingLink: "",
    location: "Visioconférence"
  });
  
  // Filtrer les rendez-vous et dossiers pour l'agent visio actuel
  const userRendezVous = rendezVous.filter(rdv => {
    const dossier = dossiers.find(d => d.id === rdv.dossierId);
    return dossier && dossier.agentVisioId === user?.id;
  });
  
  const userDossiers = dossiers.filter(d => d.agentVisioId === user?.id);
  
  // Statistiques des rendez-vous
  const rdvEnCours = userRendezVous.filter(rdv => new Date(rdv.date) > new Date()).length;
  const rdvHonores = userRendezVous.filter(rdv => rdv.honore).length;
  const rdvNonHonores = userRendezVous.filter(rdv => !rdv.honore).length;
  
  // Signatures effectuées
  const signaturesEffectuees = dossiers.filter(
    d => d.agentVisioId === user?.id && d.status === 'signe'
  ).length;
  
  // Nombre d'appels (simulé avec une valeur aléatoire entre 10 et 30)
  const nbAppels = Math.floor(Math.random() * 20) + 10;
  
  // Rendez-vous imminents (dans les 48h)
  const now = new Date();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const rdvImminents = userRendezVous.filter(rdv => {
    const rdvDate = new Date(rdv.date);
    return rdvDate > now && rdvDate <= in48Hours;
  });
  
  // Données pour le graphique des rendez-vous par statut
  const rdvStatsData = [
    { name: "En attente", value: rdvEnCours, fill: "#3B82F6" },
    { name: "Honorés", value: rdvHonores, fill: "#10B981" },
    { name: "Non honorés", value: rdvNonHonores, fill: "#EF4444" },
  ];
  
  // Agenda des rendez-vous (prochains rendez-vous triés par date)
  const prochainRdvs = [...userRendezVous]
    .filter(rdv => new Date(rdv.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Handlers pour les formulaires
  const handleAddRdv = async () => {
    // Formatter la date et l'heure
    const dateTime = new Date(`${rdvForm.date}T${rdvForm.time}`);
    
    // Créer un nouvel objet rendez-vous
    const newRdv = {
      dossierId: rdvForm.dossierId,
      date: dateTime,
      honore: rdvForm.honore,
      notes: rdvForm.notes,
      meetingLink: rdvForm.meetingLink,
      location: rdvForm.location,
      dossier: dossiers.find(d => d.id === rdvForm.dossierId)!
    };
    
    await addRendezVous(newRdv);
    setIsAddRdvOpen(false);
    resetForm();
    
    toast({
      title: "Rendez-vous créé",
      description: "Le rendez-vous a été ajouté avec succès.",
    });
  };
  
  const handleEditRdv = async () => {
    if (!selectedRdv) return;
    
    // Formatter la date et l'heure
    const dateTime = new Date(`${rdvForm.date}T${rdvForm.time}`);
    
    // Mettre à jour le rendez-vous
    await updateRendezVous(selectedRdv, {
      date: dateTime,
      honore: rdvForm.honore,
      notes: rdvForm.notes,
      meetingLink: rdvForm.meetingLink,
      location: rdvForm.location
    });
    
    setIsEditRdvOpen(false);
    resetForm();
    
    toast({
      title: "Rendez-vous modifié",
      description: "Le rendez-vous a été mis à jour avec succès.",
    });
  };
  
  const handleDeleteRdv = async () => {
    if (!selectedRdv) return;
    
    await deleteRendezVous(selectedRdv);
    setIsDeleteRdvOpen(false);
    setSelectedRdv(null);
    
    toast({
      title: "Rendez-vous supprimé",
      description: "Le rendez-vous a été supprimé avec succès.",
    });
  };
  
  const handleEditClick = (rdvId: string) => {
    const rdv = userRendezVous.find(r => r.id === rdvId);
    if (!rdv) return;
    
    const rdvDate = new Date(rdv.date);
    
    setRdvForm({
      date: format(rdvDate, "yyyy-MM-dd"),
      time: format(rdvDate, "HH:mm"),
      dossierId: rdv.dossierId,
      notes: rdv.notes || "",
      honore: rdv.honore,
      meetingLink: rdv.meetingLink || "",
      location: rdv.location || "Visioconférence"
    });
    
    setSelectedRdv(rdvId);
    setIsEditRdvOpen(true);
  };
  
  const handleDeleteClick = (rdvId: string) => {
    setSelectedRdv(rdvId);
    setIsDeleteRdvOpen(true);
  };
  
  const resetForm = () => {
    setRdvForm({
      date: "",
      time: "",
      dossierId: "",
      notes: "",
      honore: true,
      meetingLink: "",
      location: "Visioconférence"
    });
    setSelectedRdv(null);
  };

  // Find an existing rendez-vous for editing mode
  const selectedRendezVous = selectedRdv 
    ? userRendezVous.find(rdv => rdv.id === selectedRdv) 
    : undefined;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tableau de bord Agent Visio</h2>
      
      {/* Cartes de statistiques */}
      <StatsCards 
        rdvEnCours={rdvEnCours}
        rdvHonores={rdvHonores}
        rdvNonHonores={rdvNonHonores}
        signaturesEffectuees={signaturesEffectuees}
        nbAppels={nbAppels}
      />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Agenda des rendez-vous */}
        <RendezVousAgenda 
          prochainRdvs={prochainRdvs}
          dossiers={dossiers}
          onAddClick={() => setIsAddRdvOpen(true)}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
        
        {/* Graphique des rendez-vous */}
        <RendezVousChart data={rdvStatsData} />
      </div>
      
      {/* Rendez-vous imminents */}
      <RendezVousImminents 
        rdvImminents={rdvImminents}
        dossiers={dossiers}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
      
      {/* Dialogue d'ajout de rendez-vous */}
      {isAddRdvOpen && (
        <RendezVousFormDialog 
          isOpen={isAddRdvOpen}
          onOpenChange={setIsAddRdvOpen}
          dossiers={userDossiers}
          onRendezVousAdded={async (newRdv) => {
            await addRendezVous(newRdv);
            setIsAddRdvOpen(false);
            resetForm();
            toast({
              title: "Rendez-vous créé",
              description: "Le rendez-vous a été ajouté avec succès"
            });
          }}
        />
      )}
      
      {/* Dialogue de modification de rendez-vous */}
      {isEditRdvOpen && selectedRendezVous && (
        <RendezVousFormDialog 
          isOpen={isEditRdvOpen}
          onOpenChange={setIsEditRdvOpen}
          dossiers={userDossiers}
          rendezVous={selectedRendezVous}
          onRendezVousUpdated={async (id, updates) => {
            const success = await updateRendezVous(id, updates);
            if (success) {
              setIsEditRdvOpen(false);
              resetForm();
              toast({
                title: "Rendez-vous mis à jour",
                description: "Le rendez-vous a été mis à jour avec succès"
              });
            }
            return success;
          }}
        />
      )}
      
      {/* Dialogue de suppression de rendez-vous */}
      <DeleteRendezVousDialog 
        isOpen={isDeleteRdvOpen}
        onOpenChange={setIsDeleteRdvOpen}
        onDelete={handleDeleteRdv}
      />
    </div>
  );
};

export default AgentVisioStats;
