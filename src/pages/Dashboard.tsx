import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Products"
          value="156"
          icon={<Package className="w-6 h-6" />}
          trend="+12% from last month"
        />
        <StatCard
          title="Today's Sales"
          value="₹24,500"
          icon={<ShoppingCart className="w-6 h-6" />}
          trend="+5% from yesterday"
        />
        <StatCard
          title="Monthly Revenue"
          value="₹3,25,000"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="+18% from last month"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Low Stock Alert</h2>
          <div className="space-y-4">
            <LowStockItem name="Nike Air Max" stock={5} category="Shoes" />
            <LowStockItem name="Cotton Briefs L" stock={8} category="Innerwear" />
            <LowStockItem name="Sports Socks" stock={10} category="Socks" />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
          <div className="space-y-4">
            <SaleItem
              customer="John Doe"
              items={2}
              total="₹4,500"
              time="2 hours ago"
            />
            <SaleItem
              customer="Jane Smith"
              items={3}
              total="₹6,800"
              time="4 hours ago"
            />
            <SaleItem
              customer="Mike Johnson"
              items={1}
              total="₹2,200"
              time="5 hours ago"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-sm text-green-600 mt-1">{trend}</p>
      </div>
      <div className="text-primary">{icon}</div>
    </div>
  </Card>
);

const LowStockItem = ({ name, stock, category }: { name: string; stock: number; category: string }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{category}</p>
    </div>
    <span className="text-red-500 font-medium">{stock} left</span>
  </div>
);

const SaleItem = ({ customer, items, total, time }: { customer: string; items: number; total: string; time: string }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium">{customer}</p>
      <p className="text-sm text-gray-500">{items} items</p>
    </div>
    <div className="text-right">
      <p className="font-medium">{total}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  </div>
);

export default Dashboard;