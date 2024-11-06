import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  const addToCart = (product: { id: number; name: string; price: number }) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (id: number) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard
            product={{
              id: 1,
              name: "Nike Air Max",
              price: 8500,
              image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
            }}
            onAdd={addToCart}
          />
          <ProductCard
            product={{
              id: 2,
              name: "Cotton Briefs L",
              price: 450,
              image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
            }}
            onAdd={addToCart}
          />
          <ProductCard
            product={{
              id: 3,
              name: "Sports Socks",
              price: 250,
              image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500",
            }}
            onAdd={addToCart}
          />
        </div>
      </div>

      <Card className="p-4 h-[calc(100vh-2rem)] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Current Sale</h2>
        </div>

        <div className="flex-1 overflow-auto">
          {cart.map((item) => (
            <CartItemCard
              key={item.id}
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
          <Button className="w-full" size="lg">
            Complete Sale
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
  product: { id: number; name: string; price: number; image: string };
  onAdd: (product: { id: number; name: string; price: number }) => void;
}) => (
  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onAdd(product)}>
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-40 object-cover"
    />
    <div className="p-4">
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-primary font-bold">₹{product.price}</p>
    </div>
  </Card>
);

const CartItemCard = ({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}) => (
  <div className="flex items-center gap-4 py-2 border-b">
    <div className="flex-1">
      <h4 className="font-medium">{item.name}</h4>
      <p className="text-sm text-gray-600">₹{item.price}</p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
      >
        -
      </Button>
      <span className="w-8 text-center">{item.quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
      >
        +
      </Button>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500"
      onClick={() => onRemove(item.id)}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
);

export default POS;