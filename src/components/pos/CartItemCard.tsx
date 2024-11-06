import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/services/sales";

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export const CartItemCard = ({ item, onRemove, onUpdateQuantity }: CartItemCardProps) => (
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