import { supabase } from "@/lib/supabase";
import { Product } from "./inventory";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  user_id: string;
  total_amount: number;
  created_at: string;
  sale_items: {
    id: string;
    product_id: string;
    quantity: number;
    price_at_time: number;
  }[];
}

export const createSale = async (items: CartItem[], customerPhone?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const total_amount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert({ user_id: user.id, total_amount })
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
    const newStock = item.product.stock - item.quantity;
    await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', item.product.id);
  }

  return sale;
};

export const getSales = async (start: Date, end: Date) => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items (
        id,
        quantity,
        price_at_time,
        products (
          id,
          name,
          category
        )
      )
    `)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Sale[];
};