import { supabase } from '@/lib/supabase';
import { Product } from './inventory';

export interface Sale {
  id: string;
  total_amount: number;
  customer_phone?: string;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const createSale = async (items: CartItem[], customerPhone?: string) => {
  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert({
      total_amount: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      customer_phone: customerPhone
    })
    .select()
    .single();

  if (saleError) throw saleError;

  const saleItems = items.map(item => ({
    sale_id: sale.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price_at_time: item.product.price
  }));

  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(saleItems);

  if (itemsError) throw itemsError;

  // Update stock levels
  for (const item of items) {
    await supabase
      .from('products')
      .update({ stock: item.product.stock - item.quantity })
      .eq('id', item.product.id);
  }

  return sale as Sale;
};

export const getSales = async (startDate?: Date, endDate?: Date) => {
  let query = supabase
    .from('sales')
    .select(`
      *,
      sale_items (
        *,
        products (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const sendSaleConfirmation = async (saleId: string, phoneNumber: string) => {
  // This would typically call a serverless function that integrates with an SMS service
  const { error } = await supabase.functions.invoke('send-sale-confirmation', {
    body: { saleId, phoneNumber }
  });
  
  if (error) throw error;
};