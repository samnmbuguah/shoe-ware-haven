interface StatProps {
  name: string;
  sales: number;
  revenue: string;
  growth: string;
  type: "product" | "category";
}

export const StatCard = ({ name, sales, revenue, growth, type }: StatProps) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">
        {type === "product" ? `${sales} units sold` : `${sales} total sales`}
      </p>
    </div>
    <div className="text-right">
      <p className="font-medium">{revenue}</p>
      <p className="text-sm text-green-600">{growth}</p>
    </div>
  </div>
);