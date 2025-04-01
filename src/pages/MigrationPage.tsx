
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { migrateAllData } from "@/data/migration";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const MigrationPage = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleMigration = async () => {
    setIsMigrating(true);
    setLogs([]);
    
    // Rediriger les logs de la console vers notre état
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    console.log = (message, ...args) => {
      originalConsoleLog(message, ...args);
      if (typeof message === 'string') {
        setLogs(prev => [...prev, message]);
      }
    };
    
    console.error = (message, ...args) => {
      originalConsoleError(message, ...args);
      if (typeof message === 'string') {
        setLogs(prev => [...prev, `ERREUR: ${message}`]);
      }
    };
    
    try {
      const result = await migrateAllData();
      setSuccess(result);
    } catch (error) {
      console.error("Erreur inattendue pendant la migration");
      setSuccess(false);
    } finally {
      // Restaurer les fonctions de console
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      
      setIsMigrating(false);
      setIsComplete(true);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Migration des Données vers Supabase</h1>
      
      <Alert>
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>
          Cette page permet de migrer toutes les données de l'application vers Supabase. 
          Assurez-vous que les tables dans Supabase sont créées et vides avant de commencer.
          La migration peut prendre plusieurs minutes.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Migration de données</CardTitle>
          <CardDescription>
            Cliquez sur le bouton ci-dessous pour commencer la migration des données de l'application vers Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isComplete ? (
            success ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                <span>Migration terminée avec succès!</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-6 w-6" />
                <span>La migration a échoué. Consultez les logs pour plus de détails.</span>
              </div>
            )
          ) : (
            isMigrating && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Migration en cours...</span>
              </div>
            )
          )}
          
          {logs.length > 0 && (
            <div className="mt-4 border rounded-md p-2 bg-gray-50 max-h-96 overflow-y-auto">
              <pre className="text-xs">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`py-1 ${log.startsWith('ERREUR') ? 'text-red-600' : ''}`}
                  >
                    {log}
                  </div>
                ))}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleMigration} 
            disabled={isMigrating} 
            className="w-full md:w-auto"
          >
            {isMigrating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Migration en cours...
              </>
            ) : (
              'Commencer la migration'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MigrationPage;
