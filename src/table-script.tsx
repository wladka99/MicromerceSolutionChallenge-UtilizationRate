import { useMemo } from "react";
import sourceData from "./source-data.json";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

const tableData: any[] = [];
sourceData.forEach((employee) => {
  // TODO: Implement logic for preparing
});

const Example = () => {
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<any>[]>(() => [], []);

  const table = useMaterialReactTable({
    columns,
    tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
