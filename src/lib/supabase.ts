import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      customer_levels: {
        Row: {
          id: string
          name: string
          color: string
          icon: string
          order_position: number
          min_points: number | null
          min_purchase_value: number | null
          timeframe_days: number | null
          points_multiplier: number
          referral_bonus: number
          free_shipping: boolean
          exclusive_events: boolean
          custom_rewards: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          icon?: string
          order_position?: number
          min_points?: number | null
          min_purchase_value?: number | null
          timeframe_days?: number | null
          points_multiplier?: number
          referral_bonus?: number
          free_shipping?: boolean
          exclusive_events?: boolean
          custom_rewards?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          icon?: string
          order_position?: number
          min_points?: number | null
          min_purchase_value?: number | null
          timeframe_days?: number | null
          points_multiplier?: number
          referral_bonus?: number
          free_shipping?: boolean
          exclusive_events?: boolean
          custom_rewards?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          document: string
          points: number
          level_id: string
          status: 'active' | 'inactive'
          registration_date: string
          last_purchase: string | null
          address: any | null
          preferences: any | null
          email_verified: boolean
          phone_verified: boolean
          document_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          document: string
          points?: number
          level_id: string
          status?: 'active' | 'inactive'
          registration_date?: string
          last_purchase?: string | null
          address?: any | null
          preferences?: any | null
          email_verified?: boolean
          phone_verified?: boolean
          document_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          document?: string
          points?: number
          level_id?: string
          status?: 'active' | 'inactive'
          registration_date?: string
          last_purchase?: string | null
          address?: any | null
          preferences?: any | null
          email_verified?: boolean
          phone_verified?: boolean
          document_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      point_movements: {
        Row: {
          id: string
          customer_id: string
          customer_document: string
          type: 'earn' | 'redeem' | 'expire' | 'admin_adjust' | 'referral' | 'refund'
          points: number
          description: string
          date: string
          reference: string | null
          coupon_code: string | null
          created_at: string
          branch_id: string
        }
        Insert: {
          id?: string
          customer_id: string
          customer_document: string
          type: 'earn' | 'redeem' | 'expire' | 'admin_adjust' | 'referral' | 'refund'
          points: number
          description: string
          date?: string
          reference?: string | null
          coupon_code?: string | null
          created_at?: string
          branch_id: string
        }
        Update: {
          id?: string
          customer_id?: string
          customer_document?: string
          type?: 'earn' | 'redeem' | 'expire' | 'admin_adjust' | 'referral' | 'refund'
          points?: number
          description?: string
          date?: string
          reference?: string | null
          coupon_code?: string | null
          created_at?: string
          branch_id?: string
        }
      }
      rewards: {
        Row: {
          id: string
          name: string
          description: string
          points_cost: number
          type: 'discount' | 'product' | 'service' | 'custom'
          value: number
          is_active: boolean
          expiration_days: number | null
          image_url: string | null
          conditions: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          points_cost: number
          type: 'discount' | 'product' | 'service' | 'custom'
          value?: number
          is_active?: boolean
          expiration_days?: number | null
          image_url?: string | null
          conditions?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          points_cost?: number
          type?: 'discount' | 'product' | 'service' | 'custom'
          value?: number
          is_active?: boolean
          expiration_days?: number | null
          image_url?: string | null
          conditions?: any
          created_at?: string
          updated_at?: string
        }
      }
      referral_types: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          color: string
          is_active: boolean
          methods: string[]
          referrer_reward: any
          referred_reward: any
          conditions: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon?: string
          color?: string
          is_active?: boolean
          methods: string[]
          referrer_reward: any
          referred_reward: any
          conditions?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          color?: string
          is_active?: boolean
          methods?: string[]
          referrer_reward?: any
          referred_reward?: any
          conditions?: any
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referrer_document: string
          referred_id: string | null
          referred_document: string | null
          referred_identifier: string
          referred_identifier_type: 'email' | 'phone'
          referral_type_id: string
          status: 'pending' | 'validated' | 'rejected'
          date: string
          method: 'email' | 'whatsapp' | 'sms' | 'qrcode'
          validated_date: string | null
          rejected_reason: string | null
          purchase_value: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referrer_document: string
          referred_id?: string | null
          referred_document?: string | null
          referred_identifier: string
          referred_identifier_type: 'email' | 'phone'
          referral_type_id: string
          status?: 'pending' | 'validated' | 'rejected'
          date?: string
          method: 'email' | 'whatsapp' | 'sms' | 'qrcode'
          validated_date?: string | null
          rejected_reason?: string | null
          purchase_value?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referrer_document?: string
          referred_id?: string | null
          referred_document?: string | null
          referred_identifier?: string
          referred_identifier_type?: 'email' | 'phone'
          referral_type_id?: string
          status?: 'pending' | 'validated' | 'rejected'
          date?: string
          method?: 'email' | 'whatsapp' | 'sms' | 'qrcode'
          validated_date?: string | null
          rejected_reason?: string | null
          purchase_value?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          type: 'product' | 'period'
          multiplier: number
          start_date: string
          end_date: string
          products: string[]
          is_active: boolean
          widget: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'product' | 'period'
          multiplier?: number
          start_date: string
          end_date: string
          products?: string[]
          is_active?: boolean
          widget: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'product' | 'period'
          multiplier?: number
          start_date?: string
          end_date?: string
          products?: string[]
          is_active?: boolean
          widget?: any
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          company: any
          program: any
          notifications: any
          validation: any
          terms: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company: any
          program: any
          notifications: any
          validation: any
          terms?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company?: any
          program?: any
          notifications?: any
          validation?: any
          terms?: string
          created_at?: string
          updated_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          name: string
          code: string
          address: string
          phone: string
          email: string
          manager: string
          is_active: boolean
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          address: string
          phone: string
          email: string
          manager: string
          is_active?: boolean
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          address?: string
          phone?: string
          email?: string
          manager?: string
          is_active?: boolean
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}