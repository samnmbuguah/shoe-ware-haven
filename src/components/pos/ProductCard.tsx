import { Card } from "@/components/ui/card";
import { Product } from "@/services/inventory";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => (
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