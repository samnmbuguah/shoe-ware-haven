import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  created_at: string;
}

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Product[];
};

export const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
};

export const updateStock = async (id: string, quantity: number) => {
  const { data, error } = await supabase
    .from('products')
    .update({ stock: quantity })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
};