import { isQuotaExceededError } from "./isQuotaExceededError";
import { StorageQuotaError, StorageOperationError } from "./StorageErrors";

export function mapStorageError(error: unknown): Error {
  if (isQuotaExceededError(error)) {
    return new StorageQuotaError();
  }

  return new StorageOperationError(
    error instanceof Error ? error.message : "Unknown storage error"
  );
}
