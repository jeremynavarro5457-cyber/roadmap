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
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          feature_id: number
          id?: number
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          feature_id?: number
          id?: number
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
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: number
          name?: string
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
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          firstname?: string | null
          id: string
          lastname?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          firstname?: string | null
          id?: string
          lastname?: string | null
          role?: string
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
        }
        Insert: {
          created_at?: string
          end_date: string
          goal?: string | null
          id?: number
          start_date: string
          status?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          goal?: string | null
          id?: number
          start_date?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

// Raccourci : Tables<"features"> donne le type d'une ligne de la table features.
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
