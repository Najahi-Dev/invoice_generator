import { CurrencyCode, CurrencyConfig } from "@/types/invoice";

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    name: "US Dollar ($)",
    symbol: "$",
    position: "prefix",
    decimals: 2,
    locale: "en-US",
  },
  EUR: {
    code: "EUR",
    name: "Euro (€)",
    symbol: "€",
    position: "prefix",
    decimals: 2,
    locale: "de-DE",
  },
  GBP: {
    code: "GBP",
    name: "British Pound (£)",
    symbol: "£",
    position: "prefix",
    decimals: 2,
    locale: "en-GB",
  },
  JPY: {
    code: "JPY",
    name: "Japanese Yen (¥)",
    symbol: "¥",
    position: "prefix",
    decimals: 0,
    locale: "ja-JP",
  },
  INR: {
    code: "INR",
    name: "Indian Rupee (₹)",
    symbol: "₹",
    position: "prefix",
    decimals: 2,
    locale: "en-IN",
  },
  LKR: {
    code: "LKR",
    name: "Sri Lankan Rupee (Rs.)",
    symbol: "Rs. ",
    position: "prefix",
    decimals: 2,
    locale: "en-US",
  },
  CAD: {
    code: "CAD",
    name: "Canadian Dollar (CA$)",
    symbol: "CA$",
    position: "prefix",
    decimals: 2,
    locale: "en-CA",
  },
  AUD: {
    code: "AUD",
    name: "Australian Dollar (A$)",
    symbol: "A$",
    position: "prefix",
    decimals: 2,
    locale: "en-AU",
  },
  CHF: {
    code: "CHF",
    name: "Swiss Franc (CHF)",
    symbol: "CHF ",
    position: "prefix",
    decimals: 2,
    locale: "de-CH",
  },
  CNY: {
    code: "CNY",
    name: "Chinese Yuan (¥)",
    symbol: "¥",
    position: "prefix",
    decimals: 2,
    locale: "zh-CN",
  },
  AED: {
    code: "AED",
    name: "UAE Dirham (AED)",
    symbol: "AED ",
    position: "prefix",
    decimals: 2,
    locale: "en-US",
  },
  SGD: {
    code: "SGD",
    name: "Singapore Dollar (S$)",
    symbol: "S$",
    position: "prefix",
    decimals: 2,
    locale: "en-SG",
  },
  NZD: {
    code: "NZD",
    name: "New Zealand Dollar (NZ$)",
    symbol: "NZ$",
    position: "prefix",
    decimals: 2,
    locale: "en-NZ",
  },
  BRL: {
    code: "BRL",
    name: "Brazilian Real (R$)",
    symbol: "R$",
    position: "prefix",
    decimals: 2,
    locale: "pt-BR",
  },
  MXN: {
    code: "MXN",
    name: "Mexican Peso (MX$)",
    symbol: "MX$",
    position: "prefix",
    decimals: 2,
    locale: "es-MX",
  },
  ZAR: {
    code: "ZAR",
    name: "South African Rand (R)",
    symbol: "R ",
    position: "prefix",
    decimals: 2,
    locale: "en-ZA",
  },
  HKD: {
    code: "HKD",
    name: "Hong Kong Dollar (HK$)",
    symbol: "HK$",
    position: "prefix",
    decimals: 2,
    locale: "zh-HK",
  },
  SEK: {
    code: "SEK",
    name: "Swedish Krona (kr)",
    symbol: " kr",
    position: "suffix",
    decimals: 2,
    locale: "sv-SE",
  },
  NOK: {
    code: "NOK",
    name: "Norwegian Krone (kr)",
    symbol: " kr",
    position: "suffix",
    decimals: 2,
    locale: "nb-NO",
  },
  DKK: {
    code: "DKK",
    name: "Danish Krone (kr.)",
    symbol: " kr.",
    position: "suffix",
    decimals: 2,
    locale: "da-DK",
  },
  KRW: {
    code: "KRW",
    name: "South Korean Won (₩)",
    symbol: "₩",
    position: "prefix",
    decimals: 0,
    locale: "ko-KR",
  },
  TRY: {
    code: "TRY",
    name: "Turkish Lira (₺)",
    symbol: "₺",
    position: "prefix",
    decimals: 2,
    locale: "tr-TR",
  },
  SAR: {
    code: "SAR",
    name: "Saudi Riyal (SAR)",
    symbol: "SAR ",
    position: "prefix",
    decimals: 2,
    locale: "en-US",
  },
  PLN: {
    code: "PLN",
    name: "Polish Zloty (zł)",
    symbol: " zł",
    position: "suffix",
    decimals: 2,
    locale: "pl-PL",
  },
  THB: {
    code: "THB",
    name: "Thai Baht (฿)",
    symbol: "฿",
    position: "prefix",
    decimals: 2,
    locale: "th-TH",
  },
  IDR: {
    code: "IDR",
    name: "Indonesian Rupiah (Rp)",
    symbol: "Rp ",
    position: "prefix",
    decimals: 0,
    locale: "en-US",
  },
  MYR: {
    code: "MYR",
    name: "Malaysian Ringgit (RM)",
    symbol: "RM ",
    position: "prefix",
    decimals: 2,
    locale: "en-US",
  },
  PHP: {
    code: "PHP",
    name: "Philippine Peso (₱)",
    symbol: "₱",
    position: "prefix",
    decimals: 2,
    locale: "fil-PH",
  },
  VND: {
    code: "VND",
    name: "Vietnamese Dong (₫)",
    symbol: " ₫",
    position: "suffix",
    decimals: 0,
    locale: "vi-VN",
  },
  ILS: {
    code: "ILS",
    name: "Israeli Shekel (₪)",
    symbol: "₪",
    position: "prefix",
    decimals: 2,
    locale: "he-IL",
  },
  NGN: {
    code: "NGN",
    name: "Nigerian Naira (₦)",
    symbol: "₦",
    position: "prefix",
    decimals: 2,
    locale: "en-NG",
  },
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

export function getCurrencyConfig(code: CurrencyCode = "USD"): CurrencyConfig {
  return CURRENCIES[code] || CURRENCIES.USD;
}

export function formatCurrency(
  amount: number | undefined | null,
  currencyCode: CurrencyCode = "USD",
  options?: { showCode?: boolean }
): string {
  const safeAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;
  const config = getCurrencyConfig(currencyCode);

  try {
    const formattedNumber = new Intl.NumberFormat(config.locale || "en-US", {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    })
      .format(safeAmount)
      .replace(/[\u00A0\u202F]/g, " ");

    const cleanSymbol = config.symbol.trimEnd();
    const needsSpace =
      cleanSymbol.length > 1 &&
      !cleanSymbol.endsWith("$") &&
      !cleanSymbol.endsWith("€") &&
      !cleanSymbol.endsWith("£") &&
      !cleanSymbol.endsWith("¥") &&
      !cleanSymbol.endsWith("₹") &&
      !cleanSymbol.endsWith("₩") &&
      !cleanSymbol.endsWith("₺") &&
      !cleanSymbol.endsWith("₪") &&
      !cleanSymbol.endsWith("₦");

    let result =
      config.position === "prefix"
        ? `${cleanSymbol}${needsSpace ? " " : ""}${formattedNumber}`
        : `${formattedNumber}${config.symbol}`;

    if (options?.showCode) {
      result += ` ${config.code}`;
    }

    return result;
  } catch {
    const formatted = safeAmount.toFixed(config.decimals);
    return config.position === "prefix"
      ? `${config.symbol.trimEnd()} ${formatted}`
      : `${formatted}${config.symbol}`;
  }
}

export function formatNumber(
  amount: number | undefined | null,
  decimals: number = 2
): string {
  const safeAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safeAmount);
}
