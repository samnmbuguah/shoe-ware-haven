import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSales } from "@/services/sales";
import { toast } from "sonner";

const Reports = () => {
  const [period, setPeriod] = useState("today");

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    switch (period) {
      case "week":
        start.setDate(start.getDate() - 7);
        break;
      case "month":
        start.setMonth(start.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(start.getFullYear() - 1);
        break;
      default: // today
        start.setHours(0, 0, 0, 0);
        break;
    }
    return { start, end };
  };

  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales', period],
    queryFn: () => {
      const { start, end } = getDateRange();
      return getSales(start, end);
    },
    onError: () => toast.error("Failed to load sales data")
  });

  const calculateStats = () => {
    if (!sales) return { topProducts: [], categories: [], totalRevenue: 0 };

    const productMap = new Map();
    const categoryMap = new Map();
    let totalRevenue = 0;

    sales.forEach(sale => {
      totalRevenue += sale.total_amount;
      sale.sale_items.forEach((item: any) => {
        const product = item.products;
        const revenue = item.price_at_time * item.quantity;

        // Update product stats
        const productStats = productMap.get(product.id) || {
          name: product.name,
          sales: 0,
          revenue: 0
        };
        productStats.sales += item.quantity;
        productStats.revenue += revenue;
        productMap.set(product.id, productStats);

        // Update category stats
        const categoryStats = categoryMap.get(product.category) || {
          name: product.category,
          sales: 0,
          revenue: 0
        };
        categoryStats.sales += item.quantity;
        categoryStats.revenue += revenue;
        categoryMap.set(product.category, categoryStats);
      });
    });

    return {
      topProducts: Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3),
      categories: Array.from(categoryMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3),
      totalRevenue
    };
  };

  const { topProducts, categories, totalRevenue } = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <ProductStat
                key={index}
                name={product.name}
                sales={product.sales}
                revenue={`₹${product.revenue.toFixed(2)}`}
                growth="+15%" // This would need real historical data to calculate
              />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Category Performance</h2>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <CategoryStat
                key={index}
                name={category.name}
                sales={category.sales}
                revenue={`₹${category.revenue.toFixed(2)}`}
                growth="+10%" // This would need real historical data to calculate
              />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              sales?.slice(0, 5).map((sale) => (
                <TransactionRow
                  key={sale.id}
                  id={sale.id}
                  date={new Date(sale.created_at).toLocaleDateString()}
                  items={sale.sale_items.length}
                  amount={`₹${sale.total_amount.toFixed(2)}`}
                  status="Completed"
                />
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const ProductStat = ({
  name,
  sales,
  revenue,
  growth,
}: {
  name: string;
  sales: number;
  revenue: string;
  growth: string;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{sales} units sold</p>
    </div>
    <div className="text-right">
      <p className="font-medium">{revenue}</p>
      <p className="text-sm text-green-600">{growth}</p>
    </div>
  </div>
);

const CategoryStat = ({
  name,
  sales,
  revenue,
  growth,
}: {
  name: string;
  sales: number;
  revenue: string;
  growth: string;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{sales} total sales</p>
    </div>
    <div className="text-right">
      <p className="font-medium">{revenue}</p>
      <p className="text-sm text-green-600">{growth}</p>
    </div>
  </div>
);

const TransactionRow = ({
  id,
  date,
  items,
  amount,
  status,
}: {
  id: string;
  date: string;
  items: number;
  amount: string;
  status: string;
}) => (
  <TableRow>
    <TableCell className="font-medium">{id}</TableCell>
    <TableCell>{date}</TableCell>
    <TableCell>{items}</TableCell>
    <TableCell>{amount}</TableCell>
    <TableCell>
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
        {status}
      </span>
    </TableCell>
  </TableRow>
);

export default Reports;