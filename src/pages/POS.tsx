import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getProducts } from "@/services/inventory";
import { createSale, sendSaleConfirmation, type CartItem } from "@/services/sales";

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    onError: () => toast.error("Failed to load products")
  });

  const createSaleMutation = useMutation({
    mutationFn: async () => {
      const sale = await createSale(cart, customerPhone);
      if (customerPhone) {
        await sendSaleConfirmation(sale.id, customerPhone);
      }
      return sale;
    },
    onSuccess: () => {
      toast.success("Sale completed successfully!");
      setCart([]);
      setCustomerPhone("");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast.error("Failed to process sale");
    }
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    if (product.stock <= 0) {
      toast.error("Product out of stock");
      return;
    }
    
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error("Not enough stock");
          return current;
        }
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (id: string) => {
    setCart((current) => current.filter((item) => item.product.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((current) =>
      current.map((item) => {
        if (item.product.id === id) {
          if (quantity > item.product.stock) {
            toast.error("Not enough stock");
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="grid md:grid-cols-[1fr,400px] gap-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      <Card className="p-4 h-[calc(100vh-2rem)] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Current Sale</h2>
        </div>

        <Input
          type="tel"
          placeholder="Customer Phone (optional)"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="mb-4"
        />

        <div className="flex-1 overflow-auto">
          {cart.map((item) => (
            <CartItemCard
              key={item.product.id}
              item={item}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Tax (18%)</span>
            <span>₹{(total * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span>₹{(total * 1.18).toFixed(2)}</span>
          </div>
          <Button 
            className="w-full" 
            size="lg"
            disabled={cart.length === 0 || createSaleMutation.isPending}
            onClick={() => createSaleMutation.mutate()}
          >
            {createSaleMutation.isPending ? "Processing..." : "Complete Sale"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const ProductCard = ({
  product,
  onAdd,
}: {
  product: { id: string; name: string; price: number; stock: number };
  onAdd: (product: typeof product) => void;
}) => (
  <Card 
    className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${
      product.stock <= 0 ? 'opacity-50' : ''
    }`}
    onClick={() => onAdd(product)}
  >
    <div className="p-4">
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-primary font-bold">₹{product.price}</p>
      <p className="text-sm text-gray-500">{product.stock} in stock</p>
    </div>
  </Card>
);

const CartItemCard = ({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) => (
  <div className="flex items-center gap-4 py-2 border-b">
    <div className="flex-1">
      <h4 className="font-medium">{item.product.name}</h4>
      <p className="text-sm text-gray-600">₹{item.product.price}</p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
      >
        -
      </Button>
      <span className="w-8 text-center">{item.quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
      >
        +
      </Button>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500"
      onClick={() => onRemove(item.product.id)}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
);

export default POS;