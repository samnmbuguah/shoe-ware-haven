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

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Select defaultValue="today">
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
            <ProductStat
              name="Nike Air Max"
              sales={42}
              revenue="₹3,57,000"
              growth="+15%"
            />
            <ProductStat
              name="Cotton Briefs L"
              sales={38}
              revenue="₹17,100"
              growth="+8%"
            />
            <ProductStat
              name="Sports Socks"
              sales={35}
              revenue="₹8,750"
              growth="+12%"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Category Performance</h2>
          <div className="space-y-4">
            <CategoryStat
              name="Shoes"
              sales={125}
              revenue="₹8,75,000"
              growth="+20%"
            />
            <CategoryStat
              name="Innerwear"
              sales={250}
              revenue="₹1,12,500"
              growth="+5%"
            />
            <CategoryStat
              name="Socks"
              sales={180}
              revenue="₹45,000"
              growth="+10%"
            />
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
            <TransactionRow
              id="TRX001"
              date="2024-03-15"
              items={3}
              amount="₹12,500"
              status="Completed"
            />
            <TransactionRow
              id="TRX002"
              date="2024-03-15"
              items={2}
              amount="₹8,900"
              status="Completed"
            />
            <TransactionRow
              id="TRX003"
              date="2024-03-14"
              items={1}
              amount="₹4,500"
              status="Completed"
            />
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