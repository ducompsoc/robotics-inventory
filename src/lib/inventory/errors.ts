export class NotFoundError extends Error {
  constructor(
    public readonly entity: string,
    public readonly identifier: string,
  ) {
    super(`${entity} not found: ${identifier}`);
    this.name = "NotFoundError";
  }
}

export class InsufficientStockError extends Error {
  constructor(
    public readonly itemId: string,
    public readonly requested: number,
    public readonly available: number,
  ) {
    super(
      `Insufficient stock for item ${itemId}: requested ${requested}, available ${available}`,
    );
    this.name = "InsufficientStockError";
  }
}
