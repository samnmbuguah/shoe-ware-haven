import { supabase } from "@/lib/supabase";

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

export const updateStock = async (id: string, stock: number) => {
  const { data, error } = await supabase
    .from('products')
    .update({ stock })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
};