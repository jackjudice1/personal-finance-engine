/** Parses a dollar figure like "$45,000", "45k", or "45000 dollars" out of free text. */
export function extractDollarAmount(text: string): number | null {
  const kMatch = text.match(/\$?\s?([\d,]+(?:\.\d+)?)\s?k\b/i);
  if (kMatch) return parseFloat(kMatch[1].replace(/,/g, "")) * 1000;

  const plain = text.match(/\$\s?([\d,]+(?:\.\d+)?)|([\d,]+(?:\.\d+)?)\s?(?:dollars|bucks)/i);
  if (plain) return parseFloat((plain[1] ?? plain[2]).replace(/,/g, ""));

  return null;
}

/** Parses a monthly payment mention like "$600/month" or "600 a month". */
export function extractMonthlyPayment(text: string): number | null {
  const match = text.match(/\$?\s?([\d,]+(?:\.\d+)?)\s?(?:\/mo|\/month|per month|a month|monthly)/i);
  return match ? parseFloat(match[1].replace(/,/g, "")) : null;
}
