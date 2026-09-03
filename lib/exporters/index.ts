import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { DocumentMeta, ExportFormatId, NormalizedTransaction } from "@/types";

// Every converter — regardless of target format — funnels through this one
// interface. CSV, XLSX, and JSON are real, working implementations. The
// remaining formats (QuickBooks, Xero, OFX, Tally, Zoho, FreshBooks) are
// architected the same way but marked "beta" in the UI (see
// data/converters.ts) until their output has been validated against the
// real target systems — see lib/exporters/beta.ts.
export interface GeneratedFile {
  blob: Blob;
  filename: string;
  mimeType: string;
}

export interface ExportProvider {
  formatId: ExportFormatId;
  fileExtension: string;
  generate(transactions: NormalizedTransaction[], meta: DocumentMeta): GeneratedFile;
}

function baseFilename(meta: DocumentMeta) {
  const stem = meta.filename.replace(/\.pdf$/i, "");
  return stem || "statement";
}

const CSVExporter: ExportProvider = {
  formatId: "csv",
  fileExtension: ".csv",
  generate(transactions, meta) {
    const rows = transactions.map((t) => ({
      Date: t.date,
      Description: t.description,
      Reference: t.reference,
      Debit: t.debit ?? "",
      Credit: t.credit ?? "",
      Balance: t.balance ?? "",
    }));
    const csv = Papa.unparse(rows);
    return {
      blob: new Blob([csv], { type: "text/csv;charset=utf-8" }),
      filename: `${baseFilename(meta)}.csv`,
      mimeType: "text/csv",
    };
  },
};

const XLSXExporter: ExportProvider = {
  formatId: "xlsx",
  fileExtension: ".xlsx",
  generate(transactions, meta) {
    const header = ["Date", "Description", "Reference", "Debit", "Credit", "Balance"];
    const body = transactions.map((t) => [
      t.date,
      t.description,
      t.reference,
      t.debit ?? null,
      t.credit ?? null,
      t.balance ?? null,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...body]);

    // Column widths sized for readability, not just character count.
    worksheet["!cols"] = [
      { wch: 12 }, // Date
      { wch: 34 }, // Description
      { wch: 14 }, // Reference
      { wch: 12 }, // Debit
      { wch: 12 }, // Credit
      { wch: 14 }, // Balance
    ];

    // Freeze header row.
    worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };
    // Autofilter across the header.
    worksheet["!autofilter"] = {
      ref: `A1:F${body.length + 1}`,
    };

    // Number-format the date and amount columns.
    const range = XLSX.utils.decode_range(worksheet["!ref"] as string);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const dateCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 0 })];
      if (dateCell) dateCell.z = "yyyy-mm-dd";
      for (const col of [3, 4, 5]) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell && typeof cell.v === "number") cell.z = "#,##0.00";
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    return {
      blob: new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      filename: `${baseFilename(meta)}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  },
};

const JSONExporter: ExportProvider = {
  formatId: "json",
  fileExtension: ".json",
  generate(transactions, meta) {
    const payload = {
      document: {
        filename: meta.filename,
        bank: meta.bank?.name ?? null,
        currency: meta.bank?.currency ?? "USD",
        statementPeriod: {
          start: meta.statementStart,
          end: meta.statementEnd,
        },
        isDemo: meta.isDemo,
      },
      transactions: transactions.map((t) => ({
        date: t.date,
        description: t.description,
        reference: t.reference,
        debit: t.debit,
        credit: t.credit,
        balance: t.balance,
        currency: t.currency,
        category: t.category,
      })),
    };
    const json = JSON.stringify(payload, null, 2);
    return {
      blob: new Blob([json], { type: "application/json" }),
      filename: `${baseFilename(meta)}.json`,
      mimeType: "application/json",
    };
  },
};

export const exportProviders: Partial<Record<ExportFormatId, ExportProvider>> = {
  csv: CSVExporter,
  xlsx: XLSXExporter,
  json: JSONExporter,
};

export function downloadFile(file: GeneratedFile) {
  const url = URL.createObjectURL(file.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
