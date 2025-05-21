export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
          description: string | null
          order: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
          description?: string | null
          order?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
          description?: string | null
          order?: number | null
        }
        Relationships: []
      }
      category_translations: {
        Row: {
          id: number
          category_id: number
          language_code: string
          name: string
          description: string | null
        }
        Insert: {
          id?: number
          category_id: number
          language_code: string
          name: string
          description?: string | null
        }
        Update: {
          id?: number
          category_id?: number
          language_code?: string
          name?: string
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_translations_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_translations_language_code_fkey"
            columns: ["language_code"]
            referencedRelation: "languages"
            referencedColumns: ["code"]
          }
        ]
      }
      donation_methods: {
        Row: {
          id: number
          name: string
          image_url: string
          link: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          image_url: string
          link?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          image_url?: string
          link?: string | null
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          name: string
          native_name: string
          active: boolean
          rtl: boolean
          default: boolean
        }
        Insert: {
          code: string
          name: string
          native_name: string
          active?: boolean
          rtl?: boolean
          default?: boolean
        }
        Update: {
          code?: string
          name?: string
          native_name?: string
          active?: boolean
          rtl?: boolean
          default?: boolean
        }
        Relationships: []
      }
      nav_menu: {
        Row: {
          id: number
          parent_id: number | null
          name: string
          url: string
          order: number
          active: boolean
        }
        Insert: {
          id?: number
          parent_id?: number | null
          name: string
          url: string
          order?: number
          active?: boolean
        }
        Update: {
          id?: number
          parent_id?: number | null
          name?: string
          url?: string
          order?: number
          active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "nav_menu_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "nav_menu"
            referencedColumns: ["id"]
          }
        ]
      }
      nav_menu_translations: {
        Row: {
          id: number
          menu_id: number
          language_code: string
          name: string
        }
        Insert: {
          id?: number
          menu_id: number
          language_code: string
          name: string
        }
        Update: {
          id?: number
          menu_id?: number
          language_code?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "nav_menu_translations_language_code_fkey"
            columns: ["language_code"]
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "nav_menu_translations_menu_id_fkey"
            columns: ["menu_id"]
            referencedRelation: "nav_menu"
            referencedColumns: ["id"]
          }
        ]
      }
      post_categories: {
        Row: {
          post_id: number
          category_id: number
        }
        Insert: {
          post_id: number
          category_id: number
        }
        Update: {
          post_id?: number
          category_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_categories_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_categories_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      post_comments: {
        Row: {
          id: number
          post_id: number
          user_id: string | null
          parent_id: number | null
          author_name: string | null
          author_email: string | null
          content: string
          created_at: string
          approved: boolean
        }
        Insert: {
          id?: number
          post_id: number
          user_id?: string | null
          parent_id?: number | null
          author_name?: string | null
          author_email?: string | null
          content: string
          created_at?: string
          approved?: boolean
        }
        Update: {
          id?: number
          post_id?: number
          user_id?: string | null
          parent_id?: number | null
          author_name?: string | null
          author_email?: string | null
          content?: string
          created_at?: string
          approved?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      post_tags: {
        Row: {
          post_id: number
          tag_id: number
        }
        Insert: {
          post_id: number
          tag_id: number
        }
        Update: {
          post_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      post_translations: {
        Row: {
          id: number
          post_id: number
          language_code: string
          title: string
          slug: string
          excerpt: string | null
          content: string
        }
        Insert: {
          id?: number
          post_id: number
          language_code: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
        }
        Update: {
          id?: number
          post_id?: number
          language_code?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_translations_language_code_fkey"
            columns: ["language_code"]
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "post_translations_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          id: number
          author_id: string
          featured_image: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          status: string
        }
        Insert: {
          id?: number
          author_id: string
          featured_image?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          status?: string
        }
        Update: {
          id?: number
          author_id?: string
          featured_image?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      site_settings: {
        Row: {
          id: number
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_media: {
        Row: {
          id: number
          platform: string
          url: string
          icon: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          platform: string
          url: string
          icon: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          platform?: string
          url?: string
          icon?: string
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      tag_translations: {
        Row: {
          id: number
          tag_id: number
          language_code: string
          name: string
        }
        Insert: {
          id?: number
          tag_id: number
          language_code: string
          name: string
        }
        Update: {
          id?: number
          tag_id?: number
          language_code?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_translations_language_code_fkey"
            columns: ["language_code"]
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "tag_translations_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          id: number
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      tool_categories: {
        Row: {
          tool_id: number
          category_id: number
        }
        Insert: {
          tool_id: number
          category_id: number
        }
        Update: {
          tool_id?: number
          category_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tool_categories_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_categories_tool_id_fkey"
            columns: ["tool_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          }
        ]
      }
      tool_tags: {
        Row: {
          tool_id: number
          tag_id: number
        }
        Insert: {
          tool_id: number
          tag_id: number
        }
        Update: {
          tool_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tool_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_tags_tool_id_fkey"
            columns: ["tool_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          }
        ]
      }
      tool_translations: {
        Row: {
          id: number
          tool_id: number
          language_code: string
          name: string
          description: string | null
        }
        Insert: {
          id?: number
          tool_id: number
          language_code: string
          name: string
          description?: string | null
        }
        Update: {
          id?: number
          tool_id?: number
          language_code?: string
          name?: string
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_translations_language_code_fkey"
            columns: ["language_code"]
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "tool_translations_tool_id_fkey"
            columns: ["tool_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          }
        ]
      }
      tools: {
        Row: {
          id: number
          url: string
          favicon: string | null
          is_featured: boolean
          created_at: string
          updated_at: string
          submitted_by: string | null
          approved: boolean
        }
        Insert: {
          id?: number
          url: string
          favicon?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
          submitted_by?: string | null
          approved?: boolean
        }
        Update: {
          id?: number
          url?: string
          favicon?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
          submitted_by?: string | null
          approved?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "tools_submitted_by_fkey"
            columns: ["submitted_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
