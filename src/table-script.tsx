import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";

/**
 * Example of how a tableData object should be structured.
 *
 * Each `row` object has the following properties:
 * @prop {string} person - The full name of the employee.
 * @prop {number} past12Months - The value for the past 12 months.
 * @prop {number} y2d - The year-to-date value.
 * @prop {number} may - The value for May.
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */

const tableData: TableDataType[] = (
  sourceData as unknown as SourceDataType[]
).map((dataRow, index) => {

  
  const personData = dataRow.employees ?? dataRow.externals;

  const person = `${personData?.firstname ?? ""} ${personData?.lastname ?? ""}`;

  const workforceUtil = personData?.workforceUtilisation;

  const past12Months = workforceUtil?.utilisationRateLastTwelveMonths ?? "...";
  const past12MonthsNumber = parseFloat(past12Months) * 100; 

  const y2d = workforceUtil?.utilisationRateYearToDate ?? "...";
  const y2dNumber = parseFloat(y2d) * 100;

  const lastThreeMonths = workforceUtil?.lastThreeMonthsIndividually ?? [];

  
  const getUtilForMonth = (month: string) =>
    lastThreeMonths.find((m) => m.month.toLowerCase() === month.toLowerCase())?.utilisationRate ?? "...";

  const may = getUtilForMonth("may");
  const mayNumber = parseFloat(may) * 100;
  const june = getUtilForMonth("june");
  const juneNumber = parseFloat(june) * 100;
  const july = getUtilForMonth("july");
  const julyNumber = parseFloat(july) * 100;

let latestEarnings = "...";
const earningsArray = (workforceUtil as any)?.quarterEarnings;

if (Array.isArray(earningsArray) && earningsArray.length > 0) {
  const last = earningsArray[earningsArray.length - 1];
  const earnings = last?.earnings;
  const earningsNumber = parseFloat(earnings);
  if (!isNaN(earningsNumber)) {
    latestEarnings = earningsNumber.toFixed(0) + " €";
  }
} else {
  const costsArray = dataRow.externals?.costsByMonth?.costsByMonth;
  if (Array.isArray(costsArray) && costsArray.length > 0) {
    const lastCost = costsArray[costsArray.length - 1];
    const cost = lastCost?.costs;
    const costNumber = parseFloat(cost);
    if (!isNaN(costNumber)) {
      latestEarnings = costNumber.toFixed(0) + " €";
    }
  }
}


const row: TableDataType = {
  person: `${person}`,
  past12Months: isNaN(past12MonthsNumber) ? "..." : past12MonthsNumber.toFixed(0) + "%",
  y2d: isNaN(y2dNumber) ? "..." : y2dNumber.toFixed(0) + "%",
  may: isNaN(mayNumber) ? "..." : mayNumber.toFixed(0) + "%",
  june: isNaN(juneNumber) ? "..." : juneNumber.toFixed(0) + "%",
  july: isNaN(julyNumber) ? "..." : julyNumber.toFixed(0) + "%",
  netEarningsPrevMonth: latestEarnings,
};

  return row;
});

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "person",
        header: "Person",
      },
      {
        accessorKey: "past12Months",
        header: "Past 12 Months",
      },
      {
        accessorKey: "y2d",
        header: "Y2D",
      },
      {
        accessorKey: "may",
        header: "May",
      },
      {
        accessorKey: "june",
        header: "June",
      },
      {
        accessorKey: "july",
        header: "July",
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;