export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          reference_id: string | null
          reference_table: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          reference_id?: string | null
          reference_table?: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          reference_id?: string | null
          reference_table?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: []
      }
      charges: {
        Row: {
          amount_crc: number
          created_at: string
          description: string | null
          due_date: string | null
          enrollment_id: string | null
          event_participant_id: string | null
          id: string
          status: Database["public"]["Enums"]["charge_status"]
          student_id: string
          type: Database["public"]["Enums"]["charge_type"]
          updated_at: string
        }
        Insert: {
          amount_crc: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          enrollment_id?: string | null
          event_participant_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["charge_status"]
          student_id: string
          type: Database["public"]["Enums"]["charge_type"]
          updated_at?: string
        }
        Update: {
          amount_crc?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          enrollment_id?: string | null
          event_participant_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["charge_status"]
          student_id?: string
          type?: Database["public"]["Enums"]["charge_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "charges_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charges_event_participant_id_fkey"
            columns: ["event_participant_id"]
            isOneToOne: false
            referencedRelation: "event_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charges_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          capacity: number
          created_at: string
          duration_minutes: number
          enrollment_open: boolean
          id: string
          instructor_id: string | null
          is_active: boolean
          is_kids: boolean
          level: Database["public"]["Enums"]["class_level"]
          room: string | null
          start_time: string
          style_id: string
          weekday: number
        }
        Insert: {
          capacity: number
          created_at?: string
          duration_minutes?: number
          enrollment_open?: boolean
          id?: string
          instructor_id?: string | null
          is_active?: boolean
          is_kids?: boolean
          level?: Database["public"]["Enums"]["class_level"]
          room?: string | null
          start_time: string
          style_id: string
          weekday: number
        }
        Update: {
          capacity?: number
          created_at?: string
          duration_minutes?: number
          enrollment_open?: boolean
          id?: string
          instructor_id?: string | null
          is_active?: boolean
          is_kids?: boolean
          level?: Database["public"]["Enums"]["class_level"]
          room?: string | null
          start_time?: string
          style_id?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "dance_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_members: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          sort_order: number
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          sort_order?: number
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      dance_styles: {
        Row: {
          created_at: string
          id: string
          level: Database["public"]["Enums"]["class_level"]
          long_description: string | null
          name: string
          short_description: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["class_level"]
          long_description?: string | null
          name: string
          short_description?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["class_level"]
          long_description?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      enrollment_classes: {
        Row: {
          class_id: string
          enrollment_id: string
        }
        Insert: {
          class_id: string
          enrollment_id: string
        }
        Update: {
          class_id?: string
          enrollment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_classes_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          minor_name: string | null
          package_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          minor_name?: string | null
          package_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          minor_name?: string | null
          package_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          created_at: string
          event_id: string
          id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          student_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          default_choreography_crc: number | null
          default_costume_crc: number | null
          default_registration_crc: number | null
          description: string | null
          event_date: string | null
          id: string
          name: string
          photo_url: string | null
          status: Database["public"]["Enums"]["event_status"]
        }
        Insert: {
          created_at?: string
          default_choreography_crc?: number | null
          default_costume_crc?: number | null
          default_registration_crc?: number | null
          description?: string | null
          event_date?: string | null
          id?: string
          name: string
          photo_url?: string | null
          status?: Database["public"]["Enums"]["event_status"]
        }
        Update: {
          created_at?: string
          default_choreography_crc?: number | null
          default_costume_crc?: number | null
          default_registration_crc?: number | null
          description?: string | null
          event_date?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          status?: Database["public"]["Enums"]["event_status"]
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          category: Database["public"]["Enums"]["gallery_category"] | null
          created_at: string
          description: string | null
          id: string
          sort_order: number
          url: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["gallery_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          url: string
        }
        Update: {
          category?: Database["public"]["Enums"]["gallery_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      instructors: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          sort_order: number
          specialties: string[]
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          sort_order?: number
          specialties?: string[]
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          sort_order?: number
          specialties?: string[]
        }
        Relationships: []
      }
      packages: {
        Row: {
          created_at: string
          duration_days: number
          frequency: Database["public"]["Enums"]["package_frequency"]
          id: string
          is_active: boolean
          name: string
          price_crc: number
          sort_order: number
        }
        Insert: {
          created_at?: string
          duration_days?: number
          frequency: Database["public"]["Enums"]["package_frequency"]
          id?: string
          is_active?: boolean
          name: string
          price_crc: number
          sort_order?: number
        }
        Update: {
          created_at?: string
          duration_days?: number
          frequency?: Database["public"]["Enums"]["package_frequency"]
          id?: string
          is_active?: boolean
          name?: string
          price_crc?: number
          sort_order?: number
        }
        Relationships: []
      }
      payment_receipts: {
        Row: {
          amount_crc: number | null
          charge_id: string
          created_at: string
          file_path: string
          id: string
          payment_date: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sender_name: string | null
          sinpe_reference: string | null
          status: Database["public"]["Enums"]["receipt_status"]
        }
        Insert: {
          amount_crc?: number | null
          charge_id: string
          created_at?: string
          file_path: string
          id?: string
          payment_date?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sender_name?: string | null
          sinpe_reference?: string | null
          status?: Database["public"]["Enums"]["receipt_status"]
        }
        Update: {
          amount_crc?: number | null
          charge_id?: string
          created_at?: string
          file_path?: string
          id?: string
          payment_date?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sender_name?: string | null
          sinpe_reference?: string | null
          status?: Database["public"]["Enums"]["receipt_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payment_receipts_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_receipts_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_new_student: boolean
          last_name: string
          national_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email: string
          first_name: string
          id: string
          is_new_student?: boolean
          last_name: string
          national_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_new_student?: boolean
          last_name?: string
          national_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number
          key: string
          window_start: string
        }
        Insert: {
          count?: number
          key: string
          window_start?: string
        }
        Update: {
          count?: number
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          address: string | null
          contact_email: string | null
          enrollments_open: boolean
          facebook: string | null
          google_maps_url: string | null
          id: number
          instagram: string | null
          sinpe_number: string | null
          tiktok: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          enrollments_open?: boolean
          facebook?: string | null
          google_maps_url?: string | null
          id?: number
          instagram?: string | null
          sinpe_number?: string | null
          tiktok?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          enrollments_open?: boolean
          facebook?: string | null
          google_maps_url?: string | null
          id?: number
          instagram?: string | null
          sinpe_number?: string | null
          tiktok?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      trial_classes: {
        Row: {
          class_id: string
          created_at: string
          id: string
          student_id: string
          taken_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          student_id: string
          taken_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          student_id?: string
          taken_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_classes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_enrollment: {
        Args: { p_enrollment_id: string }
        Returns: undefined
      }
      check_rate_limit: {
        Args: { p_key: string; p_max: number; p_window_seconds: number }
        Returns: boolean
      }
      enroll_student: {
        Args: {
          p_class_ids: string[]
          p_minor_name?: string
          p_package_id: string
          p_student_id: string
        }
        Returns: string
      }
      get_available_capacity: { Args: { p_class_id: string }; Returns: number }
      get_student_balance: { Args: { p_student_id: string }; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      join_event: {
        Args: { p_event_id: string; p_student_id: string }
        Returns: string
      }
      take_trial_class: {
        Args: { p_class_id: string; p_student_id: string }
        Returns: string
      }
    }
    Enums: {
      charge_status: "pending" | "paid" | "overdue" | "cancelled"
      charge_type:
        | "package"
        | "trial_extra"
        | "event_costume"
        | "event_choreography"
        | "event_registration"
        | "other"
      class_level: "principiante" | "intermedio" | "avanzado" | "todos"
      enrollment_status: "pending_payment" | "active" | "expired" | "cancelled"
      event_status: "open" | "closed"
      gallery_category: "clases" | "eventos" | "sede" | "general"
      notification_type:
        | "trial_requested"
        | "receipt_uploaded"
        | "event_joined"
        | "other"
      package_frequency: "weekly_1" | "weekly_2" | "weekly_3" | "unlimited"
      receipt_status: "auto_approved" | "needs_review" | "rejected"
      user_role: "admin" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      charge_status: ["pending", "paid", "overdue", "cancelled"],
      charge_type: [
        "package",
        "trial_extra",
        "event_costume",
        "event_choreography",
        "event_registration",
        "other",
      ],
      class_level: ["principiante", "intermedio", "avanzado", "todos"],
      enrollment_status: ["pending_payment", "active", "expired", "cancelled"],
      event_status: ["open", "closed"],
      gallery_category: ["clases", "eventos", "sede", "general"],
      notification_type: [
        "trial_requested",
        "receipt_uploaded",
        "event_joined",
        "other",
      ],
      package_frequency: ["weekly_1", "weekly_2", "weekly_3", "unlimited"],
      receipt_status: ["auto_approved", "needs_review", "rejected"],
      user_role: ["admin", "student"],
    },
  },
} as const
