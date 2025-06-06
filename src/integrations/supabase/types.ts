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
      appels: {
        Row: {
          agent_id: string | null
          client_id: string | null
          code_postal: string | null
          contact: string | null
          date: string
          date_rdv: string | null
          duree: number
          email: string | null
          entreprise: string | null
          gerant: string | null
          heure_rdv: string | null
          id: string
          notes: string | null
          statut: string | null
        }
        Insert: {
          agent_id?: string | null
          client_id?: string | null
          code_postal?: string | null
          contact?: string | null
          date?: string
          date_rdv?: string | null
          duree?: number
          email?: string | null
          entreprise?: string | null
          gerant?: string | null
          heure_rdv?: string | null
          id?: string
          notes?: string | null
          statut?: string | null
        }
        Update: {
          agent_id?: string | null
          client_id?: string | null
          code_postal?: string | null
          contact?: string | null
          date?: string
          date_rdv?: string | null
          duree?: number
          email?: string | null
          entreprise?: string | null
          gerant?: string | null
          heure_rdv?: string | null
          id?: string
          notes?: string | null
          statut?: string | null
        }
        Relationships: []
      }
      auth_logs: {
        Row: {
          action: string
          id: string
          ip_address: string | null
          timestamp: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dossier_commentaires: {
        Row: {
          call_duration: number | null
          content: string
          created_at: string
          dossier_id: string | null
          id: string
          is_call_note: boolean | null
          is_public: boolean | null
          user_id: string
          user_name: string
          user_role: string
        }
        Insert: {
          call_duration?: number | null
          content: string
          created_at?: string
          dossier_id?: string | null
          id?: string
          is_call_note?: boolean | null
          is_public?: boolean | null
          user_id: string
          user_name: string
          user_role: string
        }
        Update: {
          call_duration?: number | null
          content?: string
          created_at?: string
          dossier_id?: string | null
          id?: string
          is_call_note?: boolean | null
          is_public?: boolean | null
          user_id?: string
          user_name?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_commentaires_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      dossier_consultations: {
        Row: {
          dossier_id: string | null
          id: string
          timestamp: string
          user_id: string
          user_name: string
          user_role: string
        }
        Insert: {
          dossier_id?: string | null
          id?: string
          timestamp?: string
          user_id: string
          user_name: string
          user_role: string
        }
        Update: {
          dossier_id?: string | null
          id?: string
          timestamp?: string
          user_id?: string
          user_name?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_consultations_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
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
      emails: {
        Row: {
          client_lie: string | null
          contenu: string
          date_envoi: string
          destinataire_ids: string[] | null
          destinataires_bcc: string[] | null
          destinataires_cc: string[] | null
          dossier_lie: string | null
          expediteur_id: string | null
          id: string
          lu: boolean | null
          piece_jointes: string[] | null
          sujet: string
        }
        Insert: {
          client_lie?: string | null
          contenu: string
          date_envoi?: string
          destinataire_ids?: string[] | null
          destinataires_bcc?: string[] | null
          destinataires_cc?: string[] | null
          dossier_lie?: string | null
          expediteur_id?: string | null
          id?: string
          lu?: boolean | null
          piece_jointes?: string[] | null
          sujet: string
        }
        Update: {
          client_lie?: string | null
          contenu?: string
          date_envoi?: string
          destinataire_ids?: string[] | null
          destinataires_bcc?: string[] | null
          destinataires_cc?: string[] | null
          dossier_lie?: string | null
          expediteur_id?: string | null
          id?: string
          lu?: boolean | null
          piece_jointes?: string[] | null
          sujet?: string
        }
        Relationships: []
      }
      featured_products: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          priority: number | null
          product_id: string | null
          start_date: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          priority?: number | null
          product_id?: string | null
          start_date?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          priority?: number | null
          product_id?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "offres"
            referencedColumns: ["id"]
          },
        ]
      }
      inscription_progress: {
        Row: {
          current_step: string
          form_data: Json | null
          id: string
          last_activity: string
          user_id: string | null
        }
        Insert: {
          current_step: string
          form_data?: Json | null
          id?: string
          last_activity?: string
          user_id?: string | null
        }
        Update: {
          current_step?: string
          form_data?: Json | null
          id?: string
          last_activity?: string
          user_id?: string | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          date: string
          description: string | null
          duree: number
          heure: string | null
          id: string
          lien: string | null
          participants: string[] | null
          statut: string | null
          titre: string
          type: string | null
        }
        Insert: {
          date?: string
          description?: string | null
          duree?: number
          heure?: string | null
          id?: string
          lien?: string | null
          participants?: string[] | null
          statut?: string | null
          titre: string
          type?: string | null
        }
        Update: {
          date?: string
          description?: string | null
          duree?: number
          heure?: string | null
          id?: string
          lien?: string | null
          participants?: string[] | null
          statut?: string | null
          titre?: string
          type?: string | null
        }
        Relationships: []
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
          details: Json | null
          frais_creation: string | null
          id: string
          nom: string | null
          prix: number | null
          prix_mensuel: string | null
          secteur_activite: string | null
          type: string | null
        }
        Insert: {
          description?: string | null
          details?: Json | null
          frais_creation?: string | null
          id?: string
          nom?: string | null
          prix?: number | null
          prix_mensuel?: string | null
          secteur_activite?: string | null
          type?: string | null
        }
        Update: {
          description?: string | null
          details?: Json | null
          frais_creation?: string | null
          id?: string
          nom?: string | null
          prix?: number | null
          prix_mensuel?: string | null
          secteur_activite?: string | null
          type?: string | null
        }
        Relationships: []
      }
      offres_secteurs: {
        Row: {
          created_at: string
          disponible: boolean
          id: string
          offre_id: string
          secteur_id: string
        }
        Insert: {
          created_at?: string
          disponible?: boolean
          id?: string
          offre_id: string
          secteur_id: string
        }
        Update: {
          created_at?: string
          disponible?: boolean
          id?: string
          offre_id?: string
          secteur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offres_secteurs_offre_id_fkey"
            columns: ["offre_id"]
            isOneToOne: false
            referencedRelation: "offres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offres_secteurs_secteur_id_fkey"
            columns: ["secteur_id"]
            isOneToOne: false
            referencedRelation: "secteurs_activite"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activite_detail: string | null
          adresse: string | null
          appels_decroches: number | null
          appels_emis: number | null
          appels_transformes: number | null
          besoins: string | null
          bic: string | null
          code_postal: string | null
          commentaires: string | null
          date_creation: string | null
          dossiers_signe: number | null
          dossiers_valides: number | null
          email: string | null
          equipe_id: string | null
          iban: string | null
          id: string
          moyens_communication: string[] | null
          nom: string | null
          nom_banque: string | null
          prenom: string | null
          rendez_vous_honores: number | null
          rendez_vous_non_honores: number | null
          role: string | null
          secteur_activite: string | null
          site_web: string | null
          statut_juridique: string | null
          telephone: string | null
          type_entreprise: string | null
          ville: string | null
        }
        Insert: {
          activite_detail?: string | null
          adresse?: string | null
          appels_decroches?: number | null
          appels_emis?: number | null
          appels_transformes?: number | null
          besoins?: string | null
          bic?: string | null
          code_postal?: string | null
          commentaires?: string | null
          date_creation?: string | null
          dossiers_signe?: number | null
          dossiers_valides?: number | null
          email?: string | null
          equipe_id?: string | null
          iban?: string | null
          id: string
          moyens_communication?: string[] | null
          nom?: string | null
          nom_banque?: string | null
          prenom?: string | null
          rendez_vous_honores?: number | null
          rendez_vous_non_honores?: number | null
          role?: string | null
          secteur_activite?: string | null
          site_web?: string | null
          statut_juridique?: string | null
          telephone?: string | null
          type_entreprise?: string | null
          ville?: string | null
        }
        Update: {
          activite_detail?: string | null
          adresse?: string | null
          appels_decroches?: number | null
          appels_emis?: number | null
          appels_transformes?: number | null
          besoins?: string | null
          bic?: string | null
          code_postal?: string | null
          commentaires?: string | null
          date_creation?: string | null
          dossiers_signe?: number | null
          dossiers_valides?: number | null
          email?: string | null
          equipe_id?: string | null
          iban?: string | null
          id?: string
          moyens_communication?: string[] | null
          nom?: string | null
          nom_banque?: string | null
          prenom?: string | null
          rendez_vous_honores?: number | null
          rendez_vous_non_honores?: number | null
          role?: string | null
          secteur_activite?: string | null
          site_web?: string | null
          statut_juridique?: string | null
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
          heure: string | null
          honore: boolean | null
          id: string
          location: string | null
          meeting_link: string | null
          notes: string | null
          solution_proposee: string | null
          statut: string | null
          type_rdv: string | null
        }
        Insert: {
          date?: string | null
          dossier_id?: string | null
          heure?: string | null
          honore?: boolean | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          solution_proposee?: string | null
          statut?: string | null
          type_rdv?: string | null
        }
        Update: {
          date?: string | null
          dossier_id?: string | null
          heure?: string | null
          honore?: boolean | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          solution_proposee?: string | null
          statut?: string | null
          type_rdv?: string | null
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
      secteurs_activite: {
        Row: {
          created_at: string
          description: string | null
          id: string
          nom: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          nom: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          nom?: string
        }
        Relationships: []
      }
      statistiques_backup: {
        Row: {
          appels_decroches: number | null
          appels_emis: number | null
          appels_transformes: number | null
          chiffre_affaires: number | null
          date_debut: string | null
          date_fin: string | null
          dossiers_signe: number | null
          dossiers_valides: number | null
          id: string | null
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
          id?: string | null
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
          id?: string | null
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
      user_source: {
        Row: {
          created_at: string
          id: string
          referrer: string | null
          source: string
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          referrer?: string | null
          source: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          referrer?: string | null
          source?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      agent_visio_upcoming_rdv: {
        Row: {
          date: string | null
          dossier_id: string | null
          heure: string | null
          honore: boolean | null
          id: string | null
          location: string | null
          meeting_link: string | null
          notes: string | null
          solution_proposee: string | null
          statut: string | null
          type_rdv: string | null
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
      dossiers_stats_daily: {
        Row: {
          count: number | null
          jour: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_dossier_comment: {
        Args: {
          p_dossier_id: string
          p_content: string
          p_is_call_note?: boolean
          p_call_duration?: number
          p_is_public?: boolean
        }
        Returns: string
      }
      calculate_agent_performance: {
        Args: { start_date?: string; end_date?: string }
        Returns: {
          agent_id: string
          agent_name: string
          appels_emis: number
          appels_transformes: number
          rdv_honores: number
          dossiers_valides: number
          taux_transformation: number
        }[]
      }
      calculate_conversion_metrics: {
        Args: { start_date?: string; end_date?: string }
        Returns: {
          etape: string
          total: number
          taux_conversion: number
        }[]
      }
      calculate_dossiers_by_status: {
        Args: { start_date?: string; end_date?: string }
        Returns: {
          status: string
          count: number
        }[]
      }
      calculate_rdv_completion_rate: {
        Args: { start_date?: string; end_date?: string }
        Returns: {
          total_rdv: number
          honores: number
          non_honores: number
          taux_completion: number
        }[]
      }
      create_client: {
        Args: {
          p_email: string
          p_password: string
          p_nom: string
          p_prenom: string
          p_telephone: string
          p_adresse?: string
          p_ville?: string
          p_code_postal?: string
          p_secteur_activite?: string
          p_type_entreprise?: string
          p_besoins?: string
        }
        Returns: string
      }
      get_recent_auth_logs: {
        Args: { p_limit?: number }
        Returns: {
          action: string
          id: string
          ip_address: string | null
          timestamp: string
          user_agent: string | null
          user_id: string
        }[]
      }
      get_user_auth_logs: {
        Args: { p_user_id: string }
        Returns: {
          action: string
          id: string
          ip_address: string | null
          timestamp: string
          user_agent: string | null
          user_id: string
        }[]
      }
      insert_auth_log: {
        Args: {
          p_user_id: string
          p_action: string
          p_timestamp?: string
          p_user_agent?: string
          p_ip_address?: string
        }
        Returns: {
          action: string
          id: string
          ip_address: string | null
          timestamp: string
          user_agent: string | null
          user_id: string
        }
      }
      record_call_note: {
        Args: { p_dossier_id: string; p_content: string; p_duration: number }
        Returns: string
      }
      record_dossier_consultation: {
        Args: {
          p_dossier_id: string
          p_user_id: string
          p_user_name: string
          p_user_role: string
          p_action?: string
        }
        Returns: string
      }
    }
    Enums: {
      dossier_status:
        | "prospect_chaud"
        | "prospect_froid"
        | "rdv_honore"
        | "rdv_non_honore"
        | "valide"
        | "signe"
        | "archive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      dossier_status: [
        "prospect_chaud",
        "prospect_froid",
        "rdv_honore",
        "rdv_non_honore",
        "valide",
        "signe",
        "archive",
      ],
    },
  },
} as const
