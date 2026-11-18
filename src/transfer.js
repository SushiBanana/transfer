import { validateAccountNumber, validateAmount } from "./validation.js";

export class Transfer {
  #fromAccountNumber;
  #toAccountNumber;
  #amount;

  constructor(fromAccountNumber, toAccountNumber, amount) {
    validateAccountNumber(fromAccountNumber);
    validateAccountNumber(toAccountNumber);
    validateAmount(amount);

    if (fromAccountNumber === toAccountNumber) {
      throw new Error("Cannot transfer to the same account");
    }

    this.#fromAccountNumber = fromAccountNumber;
    this.#toAccountNumber = toAccountNumber;
    this.#amount = amount;
  }

  get fromAccountNumber() {
    return this.#fromAccountNumber;
  }

  get toAccountNumber() {
    return this.#toAccountNumber;
  }

  get amount() {
    return this.#amount;
  }
}
