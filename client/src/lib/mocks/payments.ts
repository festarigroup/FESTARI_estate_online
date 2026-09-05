import { isReceiptEligible, type LinkedEntityType, type Transaction, type TransactionStatus } from "@/types/payment";

/**
 * Mock stand-in for the real payments endpoints (server side, Phase 1 —
 * not built in this branch):
 *   POST /api/payments/intent          -> createPaymentIntent
 *   GET  /api/transactions?user=me     -> listTransactions
 *   GET  /api/transactions/:id/receipt -> getReceipt
 *
 * `advanceStatus`'s timed progression (initiated -> pending -> successful/
 * failed) stands in for the real payment processor's webhook — it is the
 * ONLY thing in this module that changes a transaction's status, and it
 * only ever runs off the back of `createPaymentIntent` (i.e. a brand new
 * payment PayNowButton just started), never from a click on an existing
 * transaction. Real status changes must come from a backend webhook, per
 * spec — nothing here (or in the UI) exposes a manual "set status" action
 * on an existing row, unlike e.g. the Leads pipeline's stage selector.
 *
 * Every function here is the ONE swap point for its matching endpoint —
 * nothing outside this file should import MOCK_TRANSACTIONS directly.
 */

const LATENCY_MS = 200;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function nowIso(): string {
  return new Date().toISOString();
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function timelineUpTo(status: TransactionStatus, startHoursAgo: number): Transaction["timeline"] {
  const order: TransactionStatus[] = ["initiated", "pending_authorising", "successful"];
  const extra: Partial<Record<TransactionStatus, TransactionStatus[]>> = {
    partially_paid: ["initiated", "pending_authorising", "partially_paid"],
    refund_pending: ["initiated", "pending_authorising", "successful", "refund_pending"],
    refunded: ["initiated", "pending_authorising", "successful", "refund_pending", "refunded"],
    failed: ["initiated", "pending_authorising", "failed"],
    disputed: ["initiated", "pending_authorising", "successful", "disputed"],
  };
  const sequence = extra[status] ?? (status === "initiated" ? ["initiated"] : status === "pending_authorising" ? ["initiated", "pending_authorising"] : order);
  return sequence.map((s, i) => ({ status: s, at: hoursAgo(startHoursAgo - i * 2) }));
}

function seedTransaction(
  overrides: Partial<Transaction> & Pick<Transaction, "id" | "reference" | "amount" | "purpose" | "status" | "linkedEntity">,
): Transaction {
  const startHoursAgo = overrides.createdAt ? 0 : 72;
  return {
    currency: "GHS",
    payee: "Festari Estates",
    maskedMethod: "Visa •••• 4242",
    timeline: timelineUpTo(overrides.status, startHoursAgo),
    createdAt: hoursAgo(startHoursAgo),
    updatedAt: hoursAgo(0),
    ...overrides,
  };
}

const MOCK_TRANSACTIONS: Transaction[] = [
  seedTransaction({
    id: "txn-1",
    reference: "TXN-100231",
    amount: 1200,
    purpose: "Stay booking — Labadi Beach Hotel, 2 nights",
    status: "successful",
    linkedEntity: { type: "stay_booking", label: "Labadi Beach Hotel, 2 nights" },
    maskedMethod: "Visa •••• 4242",
  }),
  seedTransaction({
    id: "txn-2",
    reference: "TXN-100230",
    amount: 250,
    purpose: "Service engagement — Electrician callout",
    status: "pending_authorising",
    linkedEntity: { type: "service_engagement", label: "Yaw Boateng — Electrician" },
    maskedMethod: "MTN MoMo •••• 4455",
  }),
  seedTransaction({
    id: "txn-3",
    reference: "TXN-100229",
    amount: 50,
    purpose: "Listing verification fee",
    status: "successful",
    linkedEntity: { type: "verification_fee", label: "4 Bedroom Detached House, East Legon" },
    maskedMethod: "Visa •••• 4242",
  }),
  seedTransaction({
    id: "txn-4",
    reference: "TXN-100228",
    amount: 3200,
    purpose: "Stay booking — Kumasi City Apartment Suites, 1 week",
    status: "partially_paid",
    linkedEntity: { type: "stay_booking", label: "Kumasi City Apartment Suites, 1 week" },
    maskedMethod: "Mastercard •••• 8811",
  }),
  seedTransaction({
    id: "txn-5",
    reference: "TXN-100227",
    amount: 1200,
    purpose: "Stay booking — Labadi Beach Hotel, cancelled",
    status: "refunded",
    linkedEntity: { type: "stay_booking", label: "Labadi Beach Hotel, 2 nights" },
    maskedMethod: "Visa •••• 4242",
  }),
  seedTransaction({
    id: "txn-6",
    reference: "TXN-100226",
    amount: 600,
    purpose: "Service engagement — Cleaning contract deposit",
    status: "refund_pending",
    linkedEntity: { type: "service_engagement", label: "CleanPro Facility Services" },
    maskedMethod: "MTN MoMo •••• 4455",
  }),
  seedTransaction({
    id: "txn-7",
    reference: "TXN-100225",
    amount: 80,
    purpose: "Listing promotion — Featured for 7 days",
    status: "failed",
    linkedEntity: { type: "listing_promotion", label: "Studio Apartment, Osu" },
    maskedMethod: "Visa •••• 1029",
  }),
  seedTransaction({
    id: "txn-8",
    reference: "TXN-100224",
    amount: 450,
    purpose: "Stay booking — weekend getaway, disputed charge",
    status: "disputed",
    linkedEntity: { type: "stay_booking", label: "Short Stay 2 Bedroom Apartment, Labone" },
    maskedMethod: "Mastercard •••• 8811",
  }),
];

let nextId = MOCK_TRANSACTIONS.length + 1;
let nextRefSuffix = 100232;

export function countsByStatus(items: Transaction[]): Partial<Record<TransactionStatus, number>> {
  const counts: Partial<Record<TransactionStatus, number>> = {};
  for (const item of items) counts[item.status] = (counts[item.status] ?? 0) + 1;
  return counts;
}

export interface ListTransactionsParams {
  status?: TransactionStatus;
}

export function listTransactions(params: ListTransactionsParams = {}): Promise<{ items: Transaction[] }> {
  let items = [...MOCK_TRANSACTIONS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (params.status) items = items.filter((t) => t.status === params.status);
  return delay({ items });
}

export function getTransaction(id: string): Promise<Transaction | null> {
  return delay(MOCK_TRANSACTIONS.find((t) => t.id === id) ?? null);
}

function pushStatus(txn: Transaction, status: TransactionStatus): Transaction {
  const index = MOCK_TRANSACTIONS.findIndex((t) => t.id === txn.id);
  const updated: Transaction = {
    ...txn,
    status,
    timeline: [...txn.timeline, { status, at: nowIso() }],
    updatedAt: nowIso(),
  };
  if (index !== -1) MOCK_TRANSACTIONS[index] = updated;
  return updated;
}

export interface CreatePaymentIntentInput {
  entityType: LinkedEntityType;
  entityId: string;
  amount: number;
  currency?: string;
  purpose?: string;
  payee?: string;
  linkedEntityLabel?: string;
  maskedMethod?: string;
}

export interface CreatePaymentIntentResult {
  transactionId: string;
  /** Neither is real — no processor is integrated in this mock (per
   * non-goals). PayNowButton's own timed "processing" flow stands in for
   * following either of these, it never actually navigates or embeds an
   * iframe against them. */
  redirectUrl?: string;
  clientSecret?: string;
}

/** POST /api/payments/intent — creates a new Transaction in "initiated"
 * status. Callers (PayNowButton) then watch it progress to "pending" and
 * on to "successful"/"failed" via `pollTransaction`/the timed advance
 * below, exactly the way they'd poll or listen for a real webhook. */
export function createPaymentIntent(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResult> {
  const id = `txn-${nextId++}`;
  const transaction: Transaction = {
    id,
    reference: `TXN-${nextRefSuffix++}`,
    amount: input.amount,
    currency: input.currency ?? "GHS",
    payee: input.payee ?? "Festari Estates",
    purpose: input.purpose ?? "Payment",
    linkedEntity: { type: input.entityType, label: input.linkedEntityLabel ?? input.entityId },
    maskedMethod: input.maskedMethod ?? "Visa •••• 4242",
    status: "initiated",
    timeline: [{ status: "initiated", at: nowIso() }],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  MOCK_TRANSACTIONS.unshift(transaction);
  return delay({ transactionId: id, clientSecret: `mock_secret_${id}` });
}

/**
 * Simulates the backend webhook's own progression for a just-created
 * transaction: initiated -> pending_authorising -> successful (~90% of
 * the time) or failed (~10%) — standing in for a real processor's async
 * confirmation. `onStatus` fires once per stage so PayNowButton's own
 * "processing -> success/fail" UI can follow along step by step.
 */
export async function simulatePaymentProcessing(
  transactionId: string,
  onStatus: (status: TransactionStatus) => void,
): Promise<TransactionStatus> {
  const initial = await getTransaction(transactionId);
  if (!initial) throw new Error(`Transaction "${transactionId}" not found`);

  await new Promise((resolve) => setTimeout(resolve, 600));
  const pending = pushStatus(initial, "pending_authorising");
  onStatus(pending.status);

  await new Promise((resolve) => setTimeout(resolve, 1200));
  const finalStatus: TransactionStatus = Math.random() < 0.9 ? "successful" : "failed";
  const settled = pushStatus(pending, finalStatus);
  onStatus(settled.status);

  return finalStatus;
}

/** GET /api/transactions/:id/receipt — 403-equivalent (rejects) unless
 * the transaction's own status is receipt-eligible, re-checked here even
 * though the UI already hides/disables the download action for an
 * ineligible one. No real file exists behind this mock URL. */
export function getReceipt(id: string): Promise<{ url: string }> {
  const transaction = MOCK_TRANSACTIONS.find((t) => t.id === id);
  if (!transaction) return Promise.reject(new Error("Transaction not found"));
  if (!isReceiptEligible(transaction.status)) {
    return Promise.reject(new Error("This transaction has no receipt available."));
  }
  return delay({ url: `https://mock-receipts.festari.example/${transaction.reference}.pdf` });
}
