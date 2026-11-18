export function validateAmount(amount) {
  if (amount == null) {
    throw new Error("Amount is required");
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error(
      `Amount must be a positive whole number of cents, got: ${amount}`,
    );
  }
}

export function validateAccountNumber(accountNumber) {
  if (accountNumber == null) {
    throw new Error("Account number is required");
  }

  if (typeof accountNumber !== "string" || !/^\d{16}$/.test(accountNumber)) {
    throw new Error(
      `Account number must be a 16-digit string, got: ${accountNumber}`,
    );
  }
}
