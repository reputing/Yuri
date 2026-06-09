export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row:    { id: string; username: string; created_at: string }
        Insert: { id: string; username: string; created_at?: string }
        Update: { username?: string }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          gallery_id: number
          gallery_title: string | null
          gallery_cover: string | null
          gallery_num_pages: number | null
          added_at: string
        }
        Insert: {
          user_id: string
          gallery_id: number
          gallery_title?: string | null
          gallery_cover?: string | null
          gallery_num_pages?: number | null
        }
        Update: {
          gallery_title?: string | null
          gallery_cover?: string | null
          gallery_num_pages?: number | null
        }
        Relationships: []
      }
      read_history: {
        Row: {
          id: string
          user_id: string
          gallery_id: number
          last_page: number
          num_pages: number | null
          updated_at: string
        }
        Insert: {
          user_id: string
          gallery_id: number
          last_page?: number
          num_pages?: number | null
        }
        Update: {
          last_page?: number
          num_pages?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views:          Record<string, never>
    Functions:      Record<string, never>
    Enums:          Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
