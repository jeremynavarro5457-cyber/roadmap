// Types générés depuis le schéma Supabase réel (MCP generate_typescript_types).
// Ne pas modifier à la main : les régénérer si le schéma change.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          feature_id: number
          id: number
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          feature_id: number
          id?: number
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          feature_id?: number
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          effort: string | null
          id: number
          impact: string
          module_id: number | null
          priority: string
          sprint_id: number | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          effort?: string | null
          id?: number
          impact?: string
          module_id?: number | null
          priority?: string
          sprint_id?: number | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          effort?: string | null
          id?: number
          impact?: string
          module_id?: number | null
          priority?: string
          sprint_id?: number | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "features_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "features_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "features_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          firstname: string | null
          id: string
          lastname: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          firstname?: string | null
          id: string
          lastname?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          firstname?: string | null
          id?: string
          lastname?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sprints: {
        Row: {
          created_at: string
          end_date: string
          goal: string | null
          id: number
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          end_date: string
          goal?: string | null
          id?: number
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string
          goal?: string | null
          id?: number
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      get_features_with_comments_count: { Args: { p_module_id: number }; Returns: Json }
      get_modules_with_count: { Args: never; Returns: Json }
      get_sprint_summary: { Args: { p_sprint_id: number }; Returns: Json }
      get_sprints_with_count: { Args: never; Returns: Json }
      move_pending_to_next_sprint: { Args: { p_sprint_id: number }; Returns: Json }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

// Raccourci : Tables<"features"> donne le type d'une ligne de la table features.
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
