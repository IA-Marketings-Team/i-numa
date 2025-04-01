
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import DossierForm from "@/components/dossier/DossierForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const DossierEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, setCurrentDossier, currentDossier, deleteDossier } = useDossier();
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCreating = id === "nouveau" || window.location.pathname.includes("/dossiers/nouveau");
  const [isDeleting, setIsDeleting] = useState(false);

  // Log component initialization with more details
  useEffect(() => {
    console.log("[DossierEdit] Component initialized:", { 
      id, 
      isCreating, 
      userRole: user?.role,
      hasPermissions: hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']),
      currentRoute: window.location.pathname
    });
  }, [id, isCreating, user, hasPermission]);

  useEffect(() => {
    // Si nous sommes en mode création, initialiser un dossier vide
    if (isCreating) {
      console.log("[DossierEdit] Creating new dossier mode - setting currentDossier to null");
      setCurrentDossier(null);
    } else if (id) {
      // Sinon charger le dossier existant
      console.log("[DossierEdit] Loading existing dossier:", id);
      const dossier = getDossierById(id);
      if (dossier) {
        console.log("[DossierEdit] Dossier found:", dossier.id);
        setCurrentDossier(dossier);
      } else {
        console.error("[DossierEdit] Dossier not found:", id);
        navigate("/dossiers");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le dossier demandé n'existe pas."
        });
      }
    }
    
    return () => {
      console.log("[DossierEdit] Cleanup - setting currentDossier to null");
      setCurrentDossier(null);
    };
  }, [id, isCreating, getDossierById, setCurrentDossier, navigate, toast]);

  // Vérifier que l'utilisateur a les permissions nécessaires pour cette page
  useEffect(() => {
    const hasRequiredPermission = hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']);
    console.log("[DossierEdit] Permission check:", { 
      userRole: user?.role, 
      hasRequiredPermission
    });
    
    if (!hasRequiredPermission) {
      console.error("[DossierEdit] Access denied for user role:", user?.role);
      navigate("/dossiers");
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page."
      });
    }
  }, [hasPermission, navigate, toast, user]);

  const handleDelete = () => {
    if (id && id !== "nouveau" && currentDossier) {
      console.log("[DossierEdit] Deleting dossier:", id);
      deleteDossier(id);
      navigate("/dossiers");
      toast({
        title: "Dossier supprimé",
        description: "Le dossier a été supprimé avec succès."
      });
    }
    setIsDeleting(false);
  };

  // Ajouter un délai pour s'assurer que le composant est bien monté
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    console.log("[DossierEdit] Component not ready yet, waiting...");
    return null;
  }

  console.log("[DossierEdit] Rendering form with:", { 
    isCreating, 
    currentDossier: currentDossier?.id
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isCreating ? "Nouveau dossier" : "Modifier le dossier"}
        </h1>
        <div className="flex gap-2">
          {!isCreating && hasPermission(['superviseur', 'responsable']) && (
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleting(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => navigate("/dossiers")}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Annuler
          </Button>
        </div>
      </div>
      
      <DossierForm 
        dossier={currentDossier} 
        isEditing={!isCreating} 
        userRole={user?.role}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4">Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est irréversible et supprimera également tous les rendez-vous associés.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DossierEdit;
