/** Turn contract/RPC errors into short, user-friendly messages for toasts. */
export function friendlyError(message: string): string {
  if (message.includes("rejected") || message.includes("denied")) return "Transaction was cancelled.";
  if (message.includes("insufficient") || message.includes("Insufficient")) return "Insufficient balance.";
  if (message.includes("RoundNotEnded")) return "Round has not ended yet.";
  if (message.length > 80) return message.slice(0, 77) + "...";
  return message;
}
