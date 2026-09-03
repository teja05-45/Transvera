import type { DocumentMeta, NormalizedTransaction } from "@/types";

// Realistic but entirely fictional sample data used by "Try a sample
// statement". Clearly labeled as demo data everywhere it's shown, and run
// through the exact same review/export UI as a real upload would be.

export const demoDocumentMeta: DocumentMeta = {
  filename: "sample-statement.pdf",
  sizeBytes: 248_000,
  pageCount: 3,
  isDemo: true,
  bank: {
    name: "Horizon National Bank",
    country: "United States",
    currency: "USD",
    confidence: 0.97,
  },
  statementStart: "2026-07-01",
  statementEnd: "2026-07-31",
};

const rows: Array<[string, string, string, number | null, number | null, number]> = [
  ["2026-07-01", "Opening balance", "OPEN0001", null, null, 4210.55],
  ["2026-07-02", "Payroll deposit - Northwind Inc", "DEP48213", null, 3200.0, 7410.55],
  ["2026-07-03", "Grocery Mart #402", "POS55219", 86.42, null, 7324.13],
  ["2026-07-05", "Electric Co. autopay", "ACH11029", 142.87, null, 7181.26],
  ["2026-07-06", "Transfer to Savings", "XFER9931", 500.0, null, 6681.26],
  ["2026-07-08", "Riverside Coffee Roasters", "POS55388", 6.75, null, 6674.51],
  ["2026-07-09", "Client payment - Fenwick LLC", "DEP48390", null, 1850.0, 8524.51],
  ["2026-07-10", "Internet & Cable - Meridian Telecom", "ACH11144", 89.99, null, 8434.52],
  ["2026-07-12", "Downtown Parking Garage", "POS55471", 24.0, null, 8410.52],
  ["2026-07-14", "Payroll deposit - Northwind Inc", "DEP48512", null, 3200.0, 11610.52],
  ["2026-07-15", "Rent - Cascade Properties", "ACH11221", 1450.0, null, 10160.52],
  ["2026-07-16", "Green Leaf Grocers", "POS55603", 112.3, null, 10048.22],
  ["2026-07-18", "Ridehail Trip", "POS55650", 18.4, null, 10029.82],
  ["2026-07-19", "Refund - Atlas Office Supply", "DEP48601", null, 42.19, 10072.01],
  ["2026-07-21", "Gym Membership - CorePath Fitness", "ACH11309", 49.0, null, 10023.01],
  ["2026-07-22", "Client payment - Marlowe & Co", "DEP48720", null, 2100.0, 12123.01],
  ["2026-07-24", "Pharmacy - Wellview Drugs", "POS55801", 34.6, null, 12088.41],
  ["2026-07-26", "Transfer to Savings", "XFER9944", 500.0, null, 11588.41],
  ["2026-07-27", "Streaming Service - Playstream", "ACH11390", 15.99, null, 11572.42],
  ["2026-07-28", "Payroll deposit - Northwind Inc", "DEP48844", null, 3200.0, 14772.42],
  ["2026-07-29", "Hardware Store - BuildRight", "POS55902", 76.18, null, 14696.24],
  ["2026-07-30", "Restaurant - The Copper Kettle", "POS55940", 58.3, null, 14637.94],
  ["2026-07-31", "Monthly account fee", "FEE00019", 12.0, null, 14625.94],
];

export const demoTransactions: NormalizedTransaction[] = rows.map((r, i) => ({
  id: `demo-${i + 1}`,
  date: r[0],
  description: r[1],
  reference: r[2],
  debit: r[3],
  credit: r[4],
  balance: r[5],
  currency: "USD",
  category: null,
  // Two rows deliberately flagged low-confidence so the review UI has
  // something real to highlight.
  confidence: i === 12 || i === 18 ? 0.62 : 0.95 + (i % 5) * 0.01,
  needsReview: i === 12 || i === 18,
}));
