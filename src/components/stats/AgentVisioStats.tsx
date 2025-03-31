
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useDossier } from "@/contexts/DossierContext";
import { CalendarIcon, CheckCircle, XCircle, PhoneCall, FileSignature, Plus, Edit, Trash } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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
    honore: true
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
  const handleAddRdv = () => {
    // Formatter la date et l'heure
    const dateTime = new Date(`${rdvForm.date}T${rdvForm.time}`);
    
    // Créer un nouvel objet rendez-vous
    const newRdv = {
      dossierId: rdvForm.dossierId,
      date: dateTime,
      honore: rdvForm.honore,
      notes: rdvForm.notes,
      dossier: dossiers.find(d => d.id === rdvForm.dossierId)!
    };
    
    addRendezVous(newRdv);
    setIsAddRdvOpen(false);
    resetForm();
    
    toast({
      title: "Rendez-vous créé",
      description: "Le rendez-vous a été ajouté avec succès.",
    });
  };
  
  const handleEditRdv = () => {
    if (!selectedRdv) return;
    
    // Formatter la date et l'heure
    const dateTime = new Date(`${rdvForm.date}T${rdvForm.time}`);
    
    // Mettre à jour le rendez-vous
    updateRendezVous(selectedRdv, {
      date: dateTime,
      honore: rdvForm.honore,
      notes: rdvForm.notes
    });
    
    setIsEditRdvOpen(false);
    resetForm();
    
    toast({
      title: "Rendez-vous modifié",
      description: "Le rendez-vous a été mis à jour avec succès.",
    });
  };
  
  const handleDeleteRdv = () => {
    if (!selectedRdv) return;
    
    deleteRendezVous(selectedRdv);
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
      honore: rdv.honore
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
      honore: true
    });
    setSelectedRdv(null);
  };
  
  const formatDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tableau de bord Agent Visio</h2>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">RDV en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{rdvEnCours}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">RDV honorés/non honorés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-lg font-semibold">{rdvHonores}</span>
              </div>
              <div className="text-xl">/</div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-lg font-semibold">{rdvNonHonores}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Signatures effectuées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{signaturesEffectuees}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nombre d'appels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{nbAppels}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agenda des rendez-vous</CardTitle>
            <Dialog open={isAddRdvOpen} onOpenChange={setIsAddRdvOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Ajouter un RDV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un rendez-vous</DialogTitle>
                  <DialogDescription>
                    Remplissez le formulaire pour ajouter un nouveau rendez-vous.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dossier">Dossier</Label>
                    <select 
                      id="dossier"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={rdvForm.dossierId}
                      onChange={(e) => setRdvForm({...rdvForm, dossierId: e.target.value})}
                      required
                    >
                      <option value="">Sélectionnez un dossier</option>
                      {userDossiers.map(dossier => (
                        <option key={dossier.id} value={dossier.id}>
                          {dossier.client.nom} {dossier.client.prenom} - {dossier.client.secteurActivite}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={rdvForm.date} 
                        onChange={(e) => setRdvForm({...rdvForm, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Heure</Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={rdvForm.time} 
                        onChange={(e) => setRdvForm({...rdvForm, time: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input 
                      id="notes" 
                      value={rdvForm.notes} 
                      onChange={(e) => setRdvForm({...rdvForm, notes: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRdvOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddRdv}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {prochainRdvs.length > 0 ? (
              <div className="space-y-4">
                {prochainRdvs.map((rdv) => {
                  const dossier = dossiers.find(d => d.id === rdv.dossierId);
                  const rdvDate = new Date(rdv.date);
                  return (
                    <div key={rdv.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">{dossier?.client.secteurActivite}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(rdvDate)} à {format(rdvDate, "HH:mm")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClick(rdv.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(rdv.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">Aucun rendez-vous à venir</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rdvStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Nombre de RDV" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous imminents (48h)</CardTitle>
        </CardHeader>
        <CardContent>
          {rdvImminents.length > 0 ? (
            <div className="space-y-4">
              {rdvImminents.map((rdv) => {
                const dossier = dossiers.find(d => d.id === rdv.dossierId);
                const rdvDate = new Date(rdv.date);
                return (
                  <div key={rdv.id} className="p-4 border rounded-md flex justify-between items-center bg-amber-50">
                    <div>
                      <p className="font-semibold">{dossier?.client.secteurActivite}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(rdvDate)} à {format(rdvDate, "HH:mm")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Besoins: {dossier?.notes || "Non spécifiés"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(rdv.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(rdv.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">Aucun rendez-vous imminent</p>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog pour modification de rendez-vous */}
      <Dialog open={isEditRdvOpen} onOpenChange={setIsEditRdvOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le rendez-vous</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input 
                  id="edit-date" 
                  type="date" 
                  value={rdvForm.date} 
                  onChange={(e) => setRdvForm({...rdvForm, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-time">Heure</Label>
                <Input 
                  id="edit-time" 
                  type="time" 
                  value={rdvForm.time} 
                  onChange={(e) => setRdvForm({...rdvForm, time: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input 
                id="edit-notes" 
                value={rdvForm.notes} 
                onChange={(e) => setRdvForm({...rdvForm, notes: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="edit-honore">Rendez-vous honoré</Label>
              <input 
                id="edit-honore" 
                type="checkbox" 
                checked={rdvForm.honore} 
                onChange={(e) => setRdvForm({...rdvForm, honore: e.target.checked})}
                className="h-4 w-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRdvOpen(false)}>Annuler</Button>
            <Button onClick={handleEditRdv}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AlertDialog pour la suppression */}
      <AlertDialog open={isDeleteRdvOpen} onOpenChange={setIsDeleteRdvOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le rendez-vous sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteRdvOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRdv} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AgentVisioStats;
