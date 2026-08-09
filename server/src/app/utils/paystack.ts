import axios from "axios";
import { randomUUID } from "crypto";
import CustomError from "./CustomError";

// Paystack transfers require a business account to be fully verified/KYC'd
// before they'll actually move money -- not available in most dev/test
// setups. Set SIMULATE_PAYSTACK_TRANSFERS=true (see .env.development) to
// skip the real recipient/transfer calls and pretend they succeeded, so the
// rest of the withdrawal flow (debit, ledger entry, response shape) can
// still be exercised end-to-end. Deliberately a dedicated flag rather than
// NODE_ENV, since some deployed environments here have NODE_ENV=development
// set by mistake -- we don't want that to silently fake real transfers.
const isPaystackTransferSimulated = () =>
  process.env.SIMULATE_PAYSTACK_TRANSFERS === "true";

export const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYMENT_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const createPaystackPlan = async (row: { name: string; amount: string | number; interval: string }) => {
  try {
    const response = await paystack.post("/plan", {
      name: row.name,
      amount: Number(row.amount) * 100,
      interval: row.interval,
    });

    return response.data.data;
  } catch (e: any) {
    const err = getPaystackError(e);
    throw new CustomError(err.message, err.status);
  }
};

export const initializePaystackTransaction = async (payload: {
  email: string;
  amount: number;
  metadata?: Record<string, any>;
  currency?: string;
  channels?: Array<string>;
  mobile_money?: {
    phone: string;
    provider: string;
  };
}) => {
  try {
    const requestData: any = {
      email: payload.email,
      amount: payload.amount,
      metadata: payload.metadata,
      currency: payload.currency ?? "GHS",
      channels: payload.channels ?? ["mobile_money"],
    };

    if (payload.mobile_money) {
      requestData.mobile_money = {
        phone: payload.mobile_money.phone,
        provider: payload.mobile_money.provider
      };
    }
    if (process.env.PAYSTACK_CALLBACK_URL) {
      requestData.callback_url = process.env.PAYSTACK_CALLBACK_URL;
    }

    console.log('Paystack request:', JSON.stringify(requestData, null, 2));
    
    const response = await paystack.post("/transaction/initialize", requestData);
    console.log('Paystack response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data;
  } catch (e: any) {
    console.error('Paystack error:', e.response?.data || e.message);
    const err = getPaystackError(e);
    throw new CustomError(err.message, err.status);
  }
};

export const createPaystackCustomer = async (payload: {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}) => {
  try {
    const response = await paystack.post("/customer", {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      phone: payload.phone,
    });

    return response.data.data;
  } catch (e: any) {
    const err = getPaystackError(e);
    throw new CustomError(err.message, err.status);
  }
};

export const verifyPaystackPayment = async (reference: string) => {
  try {
    const response = await paystack.get(`/transaction/verify/${reference}`);
    return response.data.data;
  } catch (e: any) {
    const err = getPaystackError(e);
    throw new CustomError(err.message, err.status);
  }
};

export const subscribeToPaystackPlan = async (payload: {
  customerCode: string;
  planCode: string;
  authorization?: string;
}) => {
  try {
    const response = await paystack.post("/subscription", {
      customer: payload.customerCode,
      plan: payload.planCode,
      authorization: payload.authorization,
    });

    return response.data.data;
  } catch (e: any) {
    const err = getPaystackError(e);
    throw new CustomError(err.message, err.status);
  }
};

// Paystack requires the actual mobile money network bank_code (from
// GET /bank?currency=GHS&type=mobile_money), not a generic "mobile_money"
// string -- that's what was causing "Bank is invalid".
const MOMO_BANK_CODES: Record<string, string> = {
  mtn: "MTN",
  telecel: "VOD",
  vodafone: "VOD",
  airtel: "ATL",
  airteltigo: "ATL",
};

export const createPaystackTransferRecipient = async (payload: {
  name: string;
  phone: string;
  provider: string;
}) => {
  const bankCode = MOMO_BANK_CODES[payload.provider?.toLowerCase()];
  if (!bankCode) {
    throw new CustomError(`Unsupported mobile money provider: ${payload.provider}`, 400);
  }

  if (isPaystackTransferSimulated()) {
    const recipient_code = `RCP_sim_${randomUUID()}`;
    console.log(`[Paystack SIMULATED] transfer recipient created: ${recipient_code} (${bankCode} ${payload.phone})`);
    return { recipient_code };
  }

  try {
    const response = await paystack.post("/transferrecipient", {
      type: "mobile_money",
      name: payload.name,
      account_number: payload.phone,
      bank_code: bankCode,
      currency: "GHS",
    });
    return {
      recipient_code: response.data.data.recipient_code as string,
    };
  } catch (e: any) {
    const err = getPaystackError(e);
    throw new CustomError(err.message, err.status);
  }
};

export const initiatePaystackTransfer = async (payload: {
  amount: number;
  recipient: string;
  reason: string;
}) => {
  if (isPaystackTransferSimulated()) {
    const transfer_code = `TRF_sim_${randomUUID()}`;
    const reference = `sim_${randomUUID()}`;
    console.log(
      `[Paystack SIMULATED] transfer succeeded: ${transfer_code} amount=${payload.amount} recipient=${payload.recipient}`,
    );
    return {
      transfer_code,
      reference,
      status: "success",
      amount: payload.amount,
      recipient: payload.recipient,
      reason: payload.reason,
      simulated: true,
    };
  }

  try {
    const response = await paystack.post("/transfer", {
      source: "balance",
      amount: payload.amount,
      recipient: payload.recipient,
      reason: payload.reason,
    });
    return response.data.data;
  } catch (e: any) {
    const err = getPaystackError(e);
    throw new CustomError(err.message, err.status);
  }
};

const getPaystackError = (e: any) => {
  return {
    message:
      e?.response?.data?.message || e?.message || "Paystack request failed",
    status: e?.response?.status || 500,
    code: e?.response?.data?.code || "PAYSTACK_ERROR",
  };
};
