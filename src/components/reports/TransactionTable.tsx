import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingTableRow } from "@/components/LoadingTableRow";

interface Transaction {
  id: string;
  created_at: string;
  sale_items: any[];
  total_amount: number;
}

interface TransactionTableProps {
  sales: Transaction[] | undefined;
  isLoading: boolean;
}

export const TransactionTable = ({ sales, isLoading }: TransactionTableProps) => (
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
        <LoadingTableRow colSpan={5} />
      ) : (
        sales?.slice(0, 5).map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">{sale.id}</TableCell>
            <TableCell>{new Date(sale.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{sale.sale_items.length}</TableCell>
            <TableCell>₹{sale.total_amount.toFixed(2)}</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Completed
              </span>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
);