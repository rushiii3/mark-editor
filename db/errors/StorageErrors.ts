export class StorageQuotaError extends Error {
  constructor(message = "Storage quota exceeded") {
    super(message);
    this.name = "StorageQuotaError";
  }
}

export class StorageOperationError extends Error {
  constructor(message = "Storage operation failed") {
    super(message);
    this.name = "StorageOperationError";
  }
}
