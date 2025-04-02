import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import DossierDetail from "@/components/dossier/DossierDetail";
import VisioLimitedInfo from "@/components/dossier/VisioLimitedInfo";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Check, X, Phone } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Dossier, DossierStatus } from "@/types";

const DossierPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, setCurrentDossier, currentDossier, addRendezVous, updateDossierStatus, deleteDossier } = useDossier();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAgentVisio = user?.role === 'agent_visio';
  const [isLoading, setIsLoading] = useState(true);
  const [dossier, setDossier] = useState<Dossier | null>(null);
  
  // States for modals
  const [isAddRdvOpen, setIsAddRdvOpen] = useState(false);
  const [isCallNoteOpen, setIsCallNoteOpen] = useState(false);
  const [rdvForm, setRdvForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    notes: ""
  });
  const [callNote, setCallNote] = useState("");

  useEffect(() => {
    const loadDossier = async () => {
      setIsLoading(true);
      if (id) {
        try {
          const loadedDossier = await getDossierById(id);
          if (loadedDossier) {
            setDossier(loadedDossier);
            setCurrentDossier(loadedDossier);
          } else {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Le dossier demandé n'existe pas."
            });
            navigate("/dossiers");
          }
        } catch (error) {
          console.error("Error fetching dossier:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Erreur lors du chargement du dossier."
          });
          navigate("/dossiers");
        }
      }
      setIsLoading(false);
    };
    
    loadDossier();
    
    return () => {
      setCurrentDossier(null);
    };
  }, [id, getDossierById, setCurrentDossier, navigate, toast]);

  const handleAddRdv = async () => {
    if (!dossier) return;
    
    const dateTime = new Date(`${rdvForm.date}T${rdvForm.time}`);
    
    const newRdv = {
      dossierId: dossier.id,
      date: dateTime,
      honore: true,
      notes: rdvForm.notes,
      dossier: dossier
    };
    
    await addRendezVous(newRdv);
    setIsAddRdvOpen(false);
    
    toast({
      title: "Rendez-vous créé",
      description: "Le rendez-vous a été ajouté avec succès.",
    });
  };
  
  const handleAddCallNote = async () => {
    if (!dossier) return;
    
    // Simuler la mise à jour des notes du dossier
    const updatedNotes = dossier.notes 
      ? `${dossier.notes}\n\nAppel (${format(new Date(), "dd/MM/yyyy HH:mm")}):\n${callNote}`
      : `Appel (${format(new Date(), "dd/MM/yyyy HH:mm")}):\n${callNote}`;
    
    // Mettre à jour le dossier
    await updateDossierStatus(dossier.id, dossier.status);
    
    setIsCallNoteOpen(false);
    setCallNote("");
    
    toast({
      title: "Note d'appel ajoutée",
      description: "La note d'appel a été ajoutée avec succès.",
    });
  };
  
  const handleValidateDossier = async () => {
    if (!dossier) return;
    
    await updateDossierStatus(dossier.id, 'valide');
    
    toast({
      title: "Dossier validé",
      description: "Le dossier a été validé avec succès.",
    });
  };

  const handleStatusChange = async (status: DossierStatus) => {
    if (!dossier) return;
    
    try {
      setIsLoading(true);
      await updateDossierStatus(dossier.id, status);
      
      // Update local state
      setDossier({
        ...dossier,
        status: status
      });
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut du dossier a été modifié avec succès.`,
      });
    } catch (error) {
      console.error("Error updating dossier status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteDossier = async () => {
    if (!dossier) return;
    
    try {
      setIsLoading(true);
      await deleteDossier(dossier.id);
      
      toast({
        title: "Dossier supprimé",
        description: "Le dossier a été supprimé avec succès.",
      });
      
      navigate("/dossiers");
    } catch (error) {
      console.error("Error deleting dossier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du dossier."
      });
      setIsLoading(false);
    }
  };

  if (isLoading || !dossier) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 mb-4">Chargement du dossier...</p>
        <Button variant="outline" onClick={() => navigate("/dossiers")} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  if (isAgentVisio) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Détails du dossier</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dossiers")}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour à la liste
            </Button>
            
            {dossier.status === 'rdv_en_cours' && (
              <Button 
                onClick={handleValidateDossier}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
                Valider le dossier
              </Button>
            )}
          </div>
        </div>
        
        <VisioLimitedInfo dossier={dossier} />
        
        <div className="flex justify-between mt-6 mb-4">
          <h2 className="text-xl font-bold">Actions</h2>
          <div className="flex gap-2">
            <Dialog open={isAddRdvOpen} onOpenChange={setIsAddRdvOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Planifier un RDV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Planifier un rendez-vous</DialogTitle>
                  <DialogDescription>
                    Complétez les informations pour planifier un nouveau rendez-vous avec le client.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="date">Date</label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={rdvForm.date} 
                        onChange={(e) => setRdvForm({...rdvForm, date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="time">Heure</label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={rdvForm.time} 
                        onChange={(e) => setRdvForm({...rdvForm, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="notes">Notes</label>
                    <Textarea 
                      id="notes" 
                      value={rdvForm.notes} 
                      onChange={(e) => setRdvForm({...rdvForm, notes: e.target.value})}
                      placeholder="Informations complémentaires sur le rendez-vous..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRdvOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddRdv}>Planifier</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCallNoteOpen} onOpenChange={setIsCallNoteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Noter un appel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Note d'appel client</DialogTitle>
                  <DialogDescription>
                    Enregistrez les informations concernant votre appel avec le client.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="callNote">Détails de l'appel</label>
                    <Textarea 
                      id="callNote" 
                      value={callNote} 
                      onChange={(e) => setCallNote(e.target.value)}
                      placeholder="Résumé de l'appel, points abordés, actions à entreprendre..."
                      rows={6}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCallNoteOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddCallNote}>Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Rendez-vous</h2>
          <DossierDetail 
            dossier={dossier} 
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteDossier}
            loading={isLoading}
            userRole={user?.role}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/dossiers")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
      
      <DossierDetail 
        dossier={dossier} 
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteDossier}
        loading={isLoading}
        userRole={user?.role}
      />
    </div>
  );
};

export default DossierPage;
