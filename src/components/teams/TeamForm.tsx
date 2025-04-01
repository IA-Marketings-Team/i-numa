
import React from "react";
import { Team } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const teamSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  fonction: z.enum(["phoning", "visio", "developpement", "marketing", "mixte"]),
  description: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

interface TeamFormProps {
  initialData?: Team;
  onSubmit: (data: TeamFormValues) => void;
  onCancel: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: initialData || {
      nom: "",
      fonction: "phoning",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'équipe</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'équipe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fonction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fonction</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une fonction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="phoning">Phoning</SelectItem>
                  <SelectItem value="visio">Visio</SelectItem>
                  <SelectItem value="developpement">Développement</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="mixte">Mixte</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de l'équipe"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? "Mettre à jour" : "Créer l'équipe"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamForm;
