import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSales } from "@/services/sales";
import { StatCard } from "@/components/reports/StatCard";
import { TransactionTable } from "@/components/reports/TransactionTable";
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
    onSettled: (data, error) => {
      if (error) toast.error("Failed to load sales data");
    }
  });

  const { topProducts, categories } = calculateStats(sales);

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
              <StatCard
                key={index}
                name={product.name}
                sales={product.sales}
                revenue={`₹${product.revenue.toFixed(2)}`}
                growth="+15%"
                type="product"
              />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Category Performance</h2>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <StatCard
                key={index}
                name={category.name}
                sales={category.sales}
                revenue={`₹${category.revenue.toFixed(2)}`}
                growth="+10%"
                type="category"
              />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionTable sales={sales} isLoading={isLoading} />
      </Card>
    </div>
  );
};

const calculateStats = (sales: any[] | undefined) => {
  if (!sales) return { topProducts: [], categories: [], totalRevenue: 0 };

  const productMap = new Map();
  const categoryMap = new Map();

  sales.forEach(sale => {
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
      .slice(0, 3)
  };
};

export default Reports;