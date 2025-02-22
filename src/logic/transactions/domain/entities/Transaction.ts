export enum ServiceTransaction {
  SANTANDER = "SANTANDER",
}

export class Transaction {
  amount: number;
  description: string;
  operationDate: Date;
  referenceId: string;
  service: ServiceTransaction;

  constructor(
    amount: number,
    description: string,
    operationDate: Date,
    referenceId: string,
    service: ServiceTransaction
  ) {
    this.amount = amount;
    this.description = description;
    this.operationDate = operationDate;
    this.referenceId = referenceId;
    this.service = service;
  }
}
