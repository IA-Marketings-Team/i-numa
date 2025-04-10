import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDossierConsultations } from "./hooks/useDossierConsultations";
import { ExportButton } from "./components/ExportButton";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AccessDeniedCard from "./components/AccessDeniedCard";
import { useAuth } from "@/contexts/AuthContext";

const DossierConsultationsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    consultations,
    isLoading,
    page,
    setPage,
    totalPages,
    filters,
    setFilters,
    users,
    dossiers,
    handleExportCSV
  } = useDossierConsultations();
  const navigate = useNavigate();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Check if user has permission to view this page
  const hasPermission = user && ["superviseur", "responsable"].includes(user.role);

  if (!hasPermission) {
    return <AccessDeniedCard />;
  }

  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy à HH:mm", { locale: fr });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Historique des consultations de dossiers</h1>
        <Button variant="outline" onClick={() => navigate("/dossiers")}>
          Retour aux dossiers
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Filtrez l'historique des consultations par différents critères
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <Select
                value={filters.userFilter}
                onValueChange={(value) =>
                  setFilters({ ...filters, userFilter: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les utilisateurs</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.dossierFilter}
                onValueChange={(value) =>
                  setFilters({ ...filters, dossierFilter: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dossier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les dossiers</SelectItem>
                  {dossiers.map((dossier) => (
                    <SelectItem key={dossier.id} value={dossier.id}>
                      {dossier.client_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {filters.dateFilter ? (
                      format(filters.dateFilter, "dd/MM/yyyy")
                    ) : (
                      <span>Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFilter}
                    onSelect={(date) => {
                      setFilters({ ...filters, dateFilter: date || undefined });
                      setCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setFilters({
                search: "",
                userFilter: "",
                actionFilter: "",
                dateFilter: undefined,
                dossierFilter: ""
              })}
            >
              Réinitialiser
            </Button>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes les actions</TabsTrigger>
          <TabsTrigger value="view">Consultations</TabsTrigger>
          <TabsTrigger value="edit">Modifications</TabsTrigger>
          <TabsTrigger value="delete">Suppressions</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Historique des consultations</CardTitle>
              <ExportButton onExport={handleExportCSV} />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Dossier</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Date et heure</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                          </TableRow>
                        ))
                    ) : consultations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          Aucune consultation trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      consultations.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.userName}
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">
                              {item.userRole.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="link"
                              onClick={() => navigate(`/dossiers/${item.dossierId}`)}
                              className="p-0"
                            >
                              Voir le dossier
                            </Button>
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">{item.action}</span>
                          </TableCell>
                          <TableCell>{formatDate(item.timestamp)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>
                    Page {page} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="view">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Consultations</CardTitle>
              <ExportButton onExport={handleExportCSV} />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Dossier</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Date et heure</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                          </TableRow>
                        ))
                    ) : consultations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          Aucune consultation trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      consultations
                        .filter((item) => item.action === "view")
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.userName}
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">
                                {item.userRole.replace("_", " ")}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="link"
                                onClick={() => navigate(`/dossiers/${item.dossierId}`)}
                                className="p-0"
                              >
                                Voir le dossier
                              </Button>
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">{item.action}</span>
                            </TableCell>
                            <TableCell>{formatDate(item.timestamp)}</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>
                    Page {page} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="edit">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Modifications</CardTitle>
              <ExportButton onExport={handleExportCSV} />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Dossier</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Date et heure</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                          </TableRow>
                        ))
                    ) : consultations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          Aucune modification trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      consultations
                        .filter((item) => item.action === "edit")
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.userName}
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">
                                {item.userRole.replace("_", " ")}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="link"
                                onClick={() => navigate(`/dossiers/${item.dossierId}`)}
                                className="p-0"
                              >
                                Voir le dossier
                              </Button>
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">{item.action}</span>
                            </TableCell>
                            <TableCell>{formatDate(item.timestamp)}</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>
                    Page {page} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="delete">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Suppressions</CardTitle>
              <ExportButton onExport={handleExportCSV} />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Dossier</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Date et heure</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                          </TableRow>
                        ))
                    ) : consultations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          Aucune suppression trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      consultations
                        .filter((item) => item.action === "delete")
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.userName}
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">
                                {item.userRole.replace("_", " ")}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="link"
                                onClick={() => navigate(`/dossiers/${item.dossierId}`)}
                                className="p-0"
                              >
                                Voir le dossier
                              </Button>
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">{item.action}</span>
                            </TableCell>
                            <TableCell>{formatDate(item.timestamp)}</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>
                    Page {page} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DossierConsultationsPage;
