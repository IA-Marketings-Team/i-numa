
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AgentPerformanceStats } from "@/services/dynamicStatService";

interface AgentPerformanceTableProps {
  data: AgentPerformanceStats[];
}

export const AgentPerformanceTable: React.FC<AgentPerformanceTableProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance des agents</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead className="text-right">Appels émis</TableHead>
                <TableHead className="text-right">Appels transformés</TableHead>
                <TableHead className="text-right">RDV honorés</TableHead>
                <TableHead className="text-right">Dossiers validés</TableHead>
                <TableHead className="text-right">Taux de transformation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((agent) => (
                <TableRow key={agent.agent_id}>
                  <TableCell className="font-medium">{agent.agent_name}</TableCell>
                  <TableCell className="text-right">{agent.appels_emis}</TableCell>
                  <TableCell className="text-right">{agent.appels_transformes}</TableCell>
                  <TableCell className="text-right">{agent.rdv_honores}</TableCell>
                  <TableCell className="text-right">{agent.dossiers_valides}</TableCell>
                  <TableCell className="text-right font-medium">
                    {agent.taux_transformation.toFixed(1)}%
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

export default AgentPerformanceTable;
