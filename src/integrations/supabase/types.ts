export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          appels_decroches: number
          appels_emis: number
          appels_transformes: number
          dossiers_signe: number
          dossiers_valides: number
          equipe_id: string | null
          id: string
          rendez_vous_honores: number
          rendez_vous_non_honores: number
        }
        Insert: {
          appels_decroches?: number
          appels_emis?: number
          appels_transformes?: number
          dossiers_signe?: number
          dossiers_valides?: number
          equipe_id?: string | null
          id: string
          rendez_vous_honores?: number
          rendez_vous_non_honores?: number
        }
        Update: {
          appels_decroches?: number
          appels_emis?: number
          appels_transformes?: number
          dossiers_signe?: number
          dossiers_valides?: number
          equipe_id?: string | null
          id?: string
          rendez_vous_honores?: number
          rendez_vous_non_honores?: number
        }
        Relationships: [
          {
            foreignKeyName: "agents_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "vue_performances_equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          besoins: string
          id: string
          secteur_activite: string
          type_entreprise: string
        }
        Insert: {
          besoins: string
          id: string
          secteur_activite: string
          type_entreprise: string
        }
        Update: {
          besoins?: string
          id?: string
          secteur_activite?: string
          type_entreprise?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dossier_offres: {
        Row: {
          dossier_id: string
          id: string
          offre_id: string
        }
        Insert: {
          dossier_id: string
          id?: string
          offre_id: string
        }
        Update: {
          dossier_id?: string
          id?: string
          offre_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_offres_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossier_offres_offre_id_fkey"
            columns: ["offre_id"]
            isOneToOne: false
            referencedRelation: "offres"
            referencedColumns: ["id"]
          },
        ]
      }
      dossiers: {
        Row: {
          agent_phoner_id: string | null
          agent_visio_id: string | null
          client_id: string
          date_archivage: string | null
          date_creation: string
          date_mise_a_jour: string
          date_rdv: string | null
          date_signature: string | null
          date_validation: string | null
          id: string
          montant: number | null
          notes: string | null
          status: Database["public"]["Enums"]["dossier_status"]
        }
        Insert: {
          agent_phoner_id?: string | null
          agent_visio_id?: string | null
          client_id: string
          date_archivage?: string | null
          date_creation?: string
          date_mise_a_jour?: string
          date_rdv?: string | null
          date_signature?: string | null
          date_validation?: string | null
          id?: string
          montant?: number | null
          notes?: string | null
          status: Database["public"]["Enums"]["dossier_status"]
        }
        Update: {
          agent_phoner_id?: string | null
          agent_visio_id?: string | null
          client_id?: string
          date_archivage?: string | null
          date_creation?: string
          date_mise_a_jour?: string
          date_rdv?: string | null
          date_signature?: string | null
          date_validation?: string | null
          id?: string
          montant?: number | null
          notes?: string | null
          status?: Database["public"]["Enums"]["dossier_status"]
        }
        Relationships: [
          {
            foreignKeyName: "dossiers_agent_phoner_id_fkey"
            columns: ["agent_phoner_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossiers_agent_phoner_id_fkey"
            columns: ["agent_phoner_id"]
            isOneToOne: false
            referencedRelation: "vue_statistiques_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossiers_agent_visio_id_fkey"
            columns: ["agent_visio_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossiers_agent_visio_id_fkey"
            columns: ["agent_visio_id"]
            isOneToOne: false
            referencedRelation: "vue_statistiques_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossiers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      offres: {
        Row: {
          description: string
          id: string
          nom: string
          prix: number | null
          type: Database["public"]["Enums"]["offre_type"]
        }
        Insert: {
          description: string
          id?: string
          nom: string
          prix?: number | null
          type: Database["public"]["Enums"]["offre_type"]
        }
        Update: {
          description?: string
          id?: string
          nom?: string
          prix?: number | null
          type?: Database["public"]["Enums"]["offre_type"]
        }
        Relationships: []
      }
      rendez_vous: {
        Row: {
          date: string
          dossier_id: string
          honore: boolean
          id: string
          location: string | null
          meeting_link: string | null
          notes: string | null
        }
        Insert: {
          date: string
          dossier_id: string
          honore?: boolean
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
        }
        Update: {
          date?: string
          dossier_id?: string
          honore?: boolean
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rendez_vous_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      statistiques: {
        Row: {
          appels_decroches: number
          appels_emis: number
          appels_transformes: number
          chiffre_affaires: number | null
          date_debut: string
          date_fin: string
          dossiers_signe: number
          dossiers_valides: number
          id: string
          periode: string
          rendez_vous_honores: number
          rendez_vous_non_honores: number
        }
        Insert: {
          appels_decroches: number
          appels_emis: number
          appels_transformes: number
          chiffre_affaires?: number | null
          date_debut: string
          date_fin: string
          dossiers_signe: number
          dossiers_valides: number
          id?: string
          periode: string
          rendez_vous_honores: number
          rendez_vous_non_honores: number
        }
        Update: {
          appels_decroches?: number
          appels_emis?: number
          appels_transformes?: number
          chiffre_affaires?: number | null
          date_debut?: string
          date_fin?: string
          dossiers_signe?: number
          dossiers_valides?: number
          id?: string
          periode?: string
          rendez_vous_honores?: number
          rendez_vous_non_honores?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          agent_id: string | null
          date_creation: string
          date_echeance: string | null
          description: string | null
          id: string
          priority: string
          status: string
          title: string
        }
        Insert: {
          agent_id?: string | null
          date_creation?: string
          date_echeance?: string | null
          description?: string | null
          id?: string
          priority: string
          status: string
          title: string
        }
        Update: {
          agent_id?: string | null
          date_creation?: string
          date_echeance?: string | null
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "vue_statistiques_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          date_creation: string
          description: string | null
          fonction: Database["public"]["Enums"]["team_fonction"]
          id: string
          nom: string
        }
        Insert: {
          date_creation?: string
          description?: string | null
          fonction: Database["public"]["Enums"]["team_fonction"]
          id?: string
          nom: string
        }
        Update: {
          date_creation?: string
          description?: string | null
          fonction?: Database["public"]["Enums"]["team_fonction"]
          id?: string
          nom?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          adresse: string | null
          auth_id: string | null
          bic: string | null
          code_postal: string | null
          date_creation: string
          derniere_connexion: string | null
          email: string
          iban: string | null
          id: string
          nom: string
          nom_banque: string | null
          prenom: string
          role: Database["public"]["Enums"]["user_role"]
          telephone: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          auth_id?: string | null
          bic?: string | null
          code_postal?: string | null
          date_creation?: string
          derniere_connexion?: string | null
          email: string
          iban?: string | null
          id?: string
          nom: string
          nom_banque?: string | null
          prenom: string
          role: Database["public"]["Enums"]["user_role"]
          telephone: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          auth_id?: string | null
          bic?: string | null
          code_postal?: string | null
          date_creation?: string
          derniere_connexion?: string | null
          email?: string
          iban?: string | null
          id?: string
          nom?: string
          nom_banque?: string | null
          prenom?: string
          role?: Database["public"]["Enums"]["user_role"]
          telephone?: string
          ville?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vue_performances_equipes: {
        Row: {
          fonction: Database["public"]["Enums"]["team_fonction"] | null
          id: string | null
          nom: string | null
          nombre_agents: number | null
          total_appels_decroches: number | null
          total_appels_emis: number | null
          total_appels_transformes: number | null
          total_dossiers_signes: number | null
          total_dossiers_valides: number | null
          total_rdv_honores: number | null
        }
        Relationships: []
      }
      vue_statistiques_agents: {
        Row: {
          appels_decroches: number | null
          appels_emis: number | null
          appels_transformes: number | null
          dossiers_signe: number | null
          dossiers_valides: number | null
          email: string | null
          equipe: string | null
          id: string | null
          nom: string | null
          prenom: string | null
          rendez_vous_honores: number | null
          rendez_vous_non_honores: number | null
          taux_decroche: number | null
          taux_transformation: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      dossier_status:
        | "prospect"
        | "rdv_en_cours"
        | "valide"
        | "signe"
        | "archive"
      offre_type: "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis"
      task_priority: "low" | "medium" | "high"
      task_status: "to_do" | "in_progress" | "done"
      team_fonction:
        | "phoning"
        | "visio"
        | "developpement"
        | "marketing"
        | "mixte"
      user_role:
        | "client"
        | "agent_phoner"
        | "agent_visio"
        | "agent_developpeur"
        | "agent_marketing"
        | "superviseur"
        | "responsable"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
