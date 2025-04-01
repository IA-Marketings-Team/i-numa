
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { runMigration } from "@/scripts/migrateDataToSupabase";
import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MigrationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleMigration = async () => {
    setIsLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      await runMigration();
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || "Une erreur est survenue lors de la migration");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container max-w-2xl mx-auto my-12">
      <Card>
        <CardHeader>
          <CardTitle>Migration des données vers Supabase</CardTitle>
          <CardDescription>
            Cette page vous permet de migrer toutes les données mockées vers votre base de données Supabase.
            Attention, cette opération va créer de nouvelles données dans votre base Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>La migration va inclure :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Les équipes</li>
            <li>Les offres</li>
            <li>Les utilisateurs (clients, agents, superviseurs et responsables)</li>
            <li>Les dossiers</li>
            <li>Les rendez-vous</li>
            <li>Les tâches</li>
            <li>Les statistiques</li>
            <li>Les notifications</li>
          </ul>
          
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>
                La migration des données vers Supabase a été effectuée avec succès.
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleMigration} 
            disabled={isLoading || success}
            className="w-full"
          >
            {isLoading ? "Migration en cours..." : "Lancer la migration"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MigrationPage;
