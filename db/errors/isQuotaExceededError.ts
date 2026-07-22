export function isQuotaExceededError(error: unknown): boolean {
  if (!(error instanceof DOMException)) {
    return false;
  }

  return (
    error.name === "QuotaExceededError" || // Standard
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" || // Firefox
    error.code === 22 || // Chrome, Safari
    error.code === 1014 // Firefox
  );
}
