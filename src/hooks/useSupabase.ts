import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']

// Hook genérico para operações CRUD
export function useSupabaseTable<T extends keyof Tables>(tableName: T) {
  const [data, setData] = useState<Tables[T]['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar todos os registros
  const fetchAll = async () => {
    try {
      setLoading(true)
      const { data: result, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setData(result || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  // Inserir novo registro
  const insert = async (newData: Tables[T]['Insert']) => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(newData)
        .select()
        .single()

      if (error) throw error
      
      setData(prev => [result, ...prev])
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao inserir')
      throw err
    }
  }

  // Atualizar registro
  const update = async (id: string, updateData: Tables[T]['Update']) => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setData(prev => prev.map(item => item.id === id ? result : item))
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar')
      throw err
    }
  }

  // Deletar registro
  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (error) throw error

      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar')
      throw err
    }
  }

  useEffect(() => {
    fetchAll()
  }, [tableName])

  return {
    data,
    loading,
    error,
    fetchAll,
    insert,
    update,
    remove,
    setError
  }
}

// Hook específico para clientes com joins
export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          level:customer_levels(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar clientes')
    } finally {
      setLoading(false)
    }
  }

  const addCustomer = async (customerData: any) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          first_name: customerData.firstName,
          last_name: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          document: customerData.document,
          points: customerData.points || 0,
          level_id: customerData.level.id,
          status: customerData.status,
          email_verified: customerData.emailVerified || false,
          phone_verified: customerData.phoneVerified || false,
          document_verified: customerData.documentVerified || true
        })
        .select(`
          *,
          level:customer_levels(*)
        `)
        .single()

      if (error) throw error
      
      setCustomers(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar cliente')
      throw err
    }
  }

  const updateCustomer = async (id: string, updateData: any) => {
    try {
      const dbData: any = {}
      
      if (updateData.firstName) dbData.first_name = updateData.firstName
      if (updateData.lastName) dbData.last_name = updateData.lastName
      if (updateData.email) dbData.email = updateData.email
      if (updateData.phone) dbData.phone = updateData.phone
      if (updateData.document) dbData.document = updateData.document
      if (updateData.points !== undefined) dbData.points = updateData.points
      if (updateData.level) dbData.level_id = updateData.level.id
      if (updateData.status) dbData.status = updateData.status
      if (updateData.emailVerified !== undefined) dbData.email_verified = updateData.emailVerified
      if (updateData.phoneVerified !== undefined) dbData.phone_verified = updateData.phoneVerified
      if (updateData.documentVerified !== undefined) dbData.document_verified = updateData.documentVerified

      const { data, error } = await supabase
        .from('customers')
        .update(dbData)
        .eq('id', id)
        .select(`
          *,
          level:customer_levels(*)
        `)
        .single()

      if (error) throw error

      setCustomers(prev => prev.map(customer => customer.id === id ? data : customer))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cliente')
      throw err
    }
  }

  const findCustomerByDocument = (document: string) => {
    const cleanDocument = document.replace(/[^\d]/g, '')
    return customers.find(customer => 
      customer.document.replace(/[^\d]/g, '') === cleanDocument
    )
  }

  const findCustomerByEmail = (email: string) => {
    return customers.find(customer => 
      customer.email.toLowerCase() === email.toLowerCase()
    )
  }

  const findCustomerByPhone = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d]/g, '')
    return customers.find(customer => 
      customer.phone.replace(/[^\d]/g, '') === cleanPhone
    )
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    findCustomerByDocument,
    findCustomerByEmail,
    findCustomerByPhone,
    setError
  }
}

// Hook para movimentações de pontos
export function usePointMovements() {
  const [movements, setMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMovements = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('point_movements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMovements(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar movimentações')
    } finally {
      setLoading(false)
    }
  }

  const addMovement = async (movementData: any) => {
    try {
      const { data, error } = await supabase
        .from('point_movements')
        .insert({
          customer_id: movementData.customerId,
          customer_document: movementData.customerDocument,
          type: movementData.type,
          points: movementData.points,
          description: movementData.description,
          date: movementData.date,
          reference: movementData.reference,
          coupon_code: movementData.couponCode
        })
        .select()
        .single()

      if (error) throw error
      
      setMovements(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar movimentação')
      throw err
    }
  }

  useEffect(() => {
    fetchMovements()
  }, [])

  return {
    movements,
    loading,
    error,
    fetchMovements,
    addMovement,
    setError
  }
}