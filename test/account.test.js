import { describe, it } from "node:test"
import { Account } from "../src/account.js";
import assert from "node:assert/strict";

describe('Account.constructor', ()=> {

    it('Stores the account number and balance', () => {
        const account = new Account("1111234522226789", 500000)
        assert.strictEqual(account.accountNumber, "1111234522226789")
        assert.strictEqual(account.balance, 500000)
    })

    it('Rejects an invalid account number', () => {
        assert.throws(() => new Account("123", 500000), /account number/i)
    })

    it('Rejects a null balance as required', () => {
        assert.throws(() => new Account("1111234522226789", null), /balance is required/i)
    })

    it('Rejects an undefined balance as required', () => {
        assert.throws(() => new Account("1111234522226789", undefined), /balance is required/i)
    })

    it('Rejects a balance that is a string', () => {
        assert.throws(() => new Account("1111234522226789", "5000"), /balance/i)
    })

    it('Rejects a balance that is not a whole number of cents', () => {
        assert.throws(() => new Account("1111234522226789", 100.5), /balance/i)
    })

    it('Rejects a negative starting balance', () => {
        assert.throws(() => new Account("1111234522226789", -100), /balance/i)
    })
})

describe('Account.withdraw', () => {

    it('Reduces the balance by the amount', () => {
        const account = new Account("1111234522226789", 500000)
        account.withdraw(50000)
        assert.strictEqual(account.balance, 450000)
    })

    it('Allows withdrawing exactly the full balance', () => {
        const account = new Account("1111234522226789", 500000)
        account.withdraw(500000)
        assert.strictEqual(account.balance, 0)
    })

    it('Rejects a withdrawal that would take the balance below zero', () => {
        const account = new Account("1111234522226789", 55000)
        assert.throws(() => account.withdraw(60000), /insufficient funds/i)
    })

    it('Leaves the balance unchanged after a rejected withdrawal', () => {
        const account = new Account("1111234522226789", 55000)
        assert.throws(() => account.withdraw(60000), /insufficient funds/i)
        assert.strictEqual(account.balance, 55000)
    })

    it('Rejects an invalid amount', () => {
        const account = new Account("1111234522226789", 500000)
        assert.throws(() => account.withdraw(0), /amount/i)
    })
})

describe('Account.deposit', () => {

    it('Increases the balance by exactly the amount', () => {
        const account = new Account("1111234522226789", 500000)
        account.deposit(2560)
        assert.strictEqual(account.balance, 502560)
    })

    it('Rejects an invalid amount', () => {
        const account = new Account("1111234522226789", 500000)
        assert.throws(() => account.deposit(0), /amount/i)
    })
})