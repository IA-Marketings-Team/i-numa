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
          client_id: string | null
          date_archivage: string | null
          date_creation: string | null
          date_mise_a_jour: string | null
          date_rdv: string | null
          date_signature: string | null
          date_validation: string | null
          id: string
          montant: number | null
          notes: string | null
          status: string | null
        }
        Insert: {
          agent_phoner_id?: string | null
          agent_visio_id?: string | null
          client_id?: string | null
          date_archivage?: string | null
          date_creation?: string | null
          date_mise_a_jour?: string | null
          date_rdv?: string | null
          date_signature?: string | null
          date_validation?: string | null
          id?: string
          montant?: number | null
          notes?: string | null
          status?: string | null
        }
        Update: {
          agent_phoner_id?: string | null
          agent_visio_id?: string | null
          client_id?: string | null
          date_archivage?: string | null
          date_creation?: string | null
          date_mise_a_jour?: string | null
          date_rdv?: string | null
          date_signature?: string | null
          date_validation?: string | null
          id?: string
          montant?: number | null
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dossiers_agent_phoner_id_fkey"
            columns: ["agent_phoner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossiers_agent_visio_id_fkey"
            columns: ["agent_visio_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossiers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action: string | null
          created_at: string | null
          description: string | null
          id: string
          link: string | null
          read: boolean | null
          time: string | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          time?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          time?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offres: {
        Row: {
          description: string | null
          id: string
          nom: string | null
          prix: number | null
          type: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          nom?: string | null
          prix?: number | null
          type?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          nom?: string | null
          prix?: number | null
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          adresse: string | null
          appels_decroches: number | null
          appels_emis: number | null
          appels_transformes: number | null
          besoins: string | null
          bic: string | null
          code_postal: string | null
          date_creation: string | null
          dossiers_signe: number | null
          dossiers_valides: number | null
          email: string | null
          equipe_id: string | null
          iban: string | null
          id: string
          nom: string | null
          nom_banque: string | null
          prenom: string | null
          rendez_vous_honores: number | null
          rendez_vous_non_honores: number | null
          role: string | null
          secteur_activite: string | null
          telephone: string | null
          type_entreprise: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          appels_decroches?: number | null
          appels_emis?: number | null
          appels_transformes?: number | null
          besoins?: string | null
          bic?: string | null
          code_postal?: string | null
          date_creation?: string | null
          dossiers_signe?: number | null
          dossiers_valides?: number | null
          email?: string | null
          equipe_id?: string | null
          iban?: string | null
          id: string
          nom?: string | null
          nom_banque?: string | null
          prenom?: string | null
          rendez_vous_honores?: number | null
          rendez_vous_non_honores?: number | null
          role?: string | null
          secteur_activite?: string | null
          telephone?: string | null
          type_entreprise?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          appels_decroches?: number | null
          appels_emis?: number | null
          appels_transformes?: number | null
          besoins?: string | null
          bic?: string | null
          code_postal?: string | null
          date_creation?: string | null
          dossiers_signe?: number | null
          dossiers_valides?: number | null
          email?: string | null
          equipe_id?: string | null
          iban?: string | null
          id?: string
          nom?: string | null
          nom_banque?: string | null
          prenom?: string | null
          rendez_vous_honores?: number | null
          rendez_vous_non_honores?: number | null
          role?: string | null
          secteur_activite?: string | null
          telephone?: string | null
          type_entreprise?: string | null
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      rendez_vous: {
        Row: {
          date: string | null
          dossier_id: string | null
          honore: boolean | null
          id: string
          location: string | null
          meeting_link: string | null
          notes: string | null
        }
        Insert: {
          date?: string | null
          dossier_id?: string | null
          honore?: boolean | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
        }
        Update: {
          date?: string | null
          dossier_id?: string | null
          honore?: boolean | null
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
          appels_decroches: number | null
          appels_emis: number | null
          appels_transformes: number | null
          chiffre_affaires: number | null
          date_debut: string | null
          date_fin: string | null
          dossiers_signe: number | null
          dossiers_valides: number | null
          id: string
          periode: string | null
          rendez_vous_honores: number | null
          rendez_vous_non_honores: number | null
        }
        Insert: {
          appels_decroches?: number | null
          appels_emis?: number | null
          appels_transformes?: number | null
          chiffre_affaires?: number | null
          date_debut?: string | null
          date_fin?: string | null
          dossiers_signe?: number | null
          dossiers_valides?: number | null
          id?: string
          periode?: string | null
          rendez_vous_honores?: number | null
          rendez_vous_non_honores?: number | null
        }
        Update: {
          appels_decroches?: number | null
          appels_emis?: number | null
          appels_transformes?: number | null
          chiffre_affaires?: number | null
          date_debut?: string | null
          date_fin?: string | null
          dossiers_signe?: number | null
          dossiers_valides?: number | null
          id?: string
          periode?: string | null
          rendez_vous_honores?: number | null
          rendez_vous_non_honores?: number | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          agent_id: string | null
          date_creation: string | null
          date_echeance: string | null
          description: string | null
          id: string
          priority: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          agent_id?: string | null
          date_creation?: string | null
          date_echeance?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          agent_id?: string | null
          date_creation?: string | null
          date_echeance?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          date_creation: string | null
          description: string | null
          fonction: string | null
          id: string
          nom: string | null
        }
        Insert: {
          date_creation?: string | null
          description?: string | null
          fonction?: string | null
          id?: string
          nom?: string | null
        }
        Update: {
          date_creation?: string | null
          description?: string | null
          fonction?: string | null
          id?: string
          nom?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
