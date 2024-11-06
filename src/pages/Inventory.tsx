import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { getProducts } from "@/services/inventory";
import { ProductTable } from "@/components/inventory/ProductTable";

const Inventory = () => {
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    onSuccess: () => {
      // Handle success if needed
    },
    onError: (error: Error) => {
      toast.error("Failed to load products");
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <ProductTable 
          products={products}
          isLoading={isLoading}
          search={search}
        />
      </Card>
    </div>
  );
};

export default Inventory;