import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";

const Inventory = () => {
  const [search, setSearch] = useState("");

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

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ProductRow
                name="Nike Air Max"
                category="Shoes"
                stock={15}
                price="₹8,500"
                status="In Stock"
              />
              <ProductRow
                name="Cotton Briefs L"
                category="Innerwear"
                stock={8}
                price="₹450"
                status="Low Stock"
              />
              <ProductRow
                name="Sports Socks"
                category="Socks"
                stock={45}
                price="₹250"
                status="In Stock"
              />
              <ProductRow
                name="Running Shoes"
                category="Shoes"
                stock={0}
                price="₹6,500"
                status="Out of Stock"
              />
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

const ProductRow = ({
  name,
  category,
  stock,
  price,
  status,
}: {
  name: string;
  category: string;
  stock: number;
  price: string;
  status: string;
}) => (
  <TableRow>
    <TableCell className="font-medium">{name}</TableCell>
    <TableCell>{category}</TableCell>
    <TableCell>{stock}</TableCell>
    <TableCell>{price}</TableCell>
    <TableCell>
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          status === "In Stock"
            ? "bg-green-100 text-green-800"
            : status === "Low Stock"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {status}
      </span>
    </TableCell>
  </TableRow>
);

export default Inventory;