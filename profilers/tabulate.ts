import AsciiTable from "ascii-table";

export const tabulate = (
  title: string,
  headers: string[],
  rows: string[][],
): string =>
  rows
    .reduce(
      (acc, [k, v]) => acc.addRow(k, v),
      new AsciiTable(title).setHeading(headers),
    )
    .toString();
