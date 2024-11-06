import { TableCell, TableRow } from "@/components/ui/table";

export const LoadingTableRow = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-8">
      Loading...
    </TableCell>
  </TableRow>
);