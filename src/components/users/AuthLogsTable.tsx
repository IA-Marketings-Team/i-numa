
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AuthLog } from '@/types';
import { fetchAuthLogsByUser } from '@/services/authLogService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogIn, LogOut } from 'lucide-react';

interface AuthLogsTableProps {
  userId: string;
}

const AuthLogsTable: React.FC<AuthLogsTableProps> = ({ userId }) => {
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const response = await fetchAuthLogsByUser(userId);
        if (response.success && response.data) {
          // Cast the response data to AuthLog[]
          const typedLogs = response.data.map((log: any) => ({
            id: log.id,
            user_id: log.user_id,
            userId: log.user_id,
            action: log.action,
            timestamp: log.timestamp,
            userAgent: log.user_agent,
            user_agent: log.user_agent,
            ipAddress: log.ip_address,
            ip_address: log.ip_address
          })) as AuthLog[];
          
          setLogs(typedLogs);
        } else {
          console.error(`Erreur lors du chargement des journaux:`, response.error);
        }
      } catch (error) {
        console.error(`Erreur lors du chargement des journaux pour l'utilisateur ${userId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [userId]);

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy à HH:mm:ss', { locale: fr });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-xl">Journaux de connexion</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Chargement des journaux...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-4">Aucun journal d'authentification trouvé</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden md:table-cell">Navigateur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {log.action === 'login' ? (
                        <>
                          <LogIn className="h-4 w-4 text-green-500" />
                          <span>Connexion</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4 text-red-500" />
                          <span>Déconnexion</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {(log.userAgent || log.user_agent) 
                      ? (log.userAgent || log.user_agent).substring(0, 50) + ((log.userAgent || log.user_agent).length > 50 ? '...' : '') 
                      : 'Non disponible'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthLogsTable;
