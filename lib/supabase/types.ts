export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; username: string; created_at: string }
        Insert: { id: string; username: string; created_at?: string }
        Update: { username?: string }
      }
      favorites: {
        Row: { id: string; user_id: string; gallery_id: number; gallery_title: string | null; gallery_cover: string | null; gallery_num_pages: number | null; added_at: string }
        Insert: { user_id: string; gallery_id: number; gallery_title?: string | null; gallery_cover?: string | null; gallery_num_pages?: number | null }
        Update: {}
      }
      read_history: {
        Row: { id: string; user_id: string; gallery_id: number; last_page: number; num_pages: number | null; updated_at: string }
        Insert: { user_id: string; gallery_id: number; last_page?: number; num_pages?: number | null }
        Update: { last_page?: number; num_pages?: number | null; updated_at?: string }
      }
    }
  }
}
