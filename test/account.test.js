import { describe, it } from "node:test"
import { Account } from "../src/account.js";
import assert from "node:assert/strict";

describe('Account.constructor', ()=> {

    it('Stores the account number and balance', () => {
        const account = new Account("1111234522226789", 500000)
        assert.strictEqual(account.accountNumber, "1111234522226789")
        assert.strictEqual(account.balance, 500000)
    })

    it('Accepts an account number with a leading zero', () => {
        const account = new Account("0111234522226789", 500000)
        assert.strictEqual(account.accountNumber, "0111234522226789")
    })

    it('Rejects an account number shorter than 16 digits', () => {
        assert.throws(() => new Account("123", 500000), /account number/i)
    })

    it('Rejects an account number longer than 16 digits', () => {
        assert.throws(() => new Account("11112345222267890", 500000), /account number/i)
    })

    it('Rejects an account number containing letters', () => {
        assert.throws(() => new Account("11112345222267ab", 500000), /account number/i)
    })

    it('Rejects an account number that is a number', () => {
        assert.throws(() => new Account(1111234522226789, 500000), /account number/i)
    })

    it('Rejects a missing account number', () => {
        assert.throws(() => new Account(null, 500000), /account number/i)
    })

    it('Rejects a missing balance', () => {
        assert.throws(() => new Account("1111234522226789", null), /balance/i)
    })

    it('Rejects a balance that is a string', () => {
        assert.throws(() => new Account("1111234522226789", "5000"), /balance/i)
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

    it('Rejects a zero amount', () => {
        const account = new Account("1111234522226789", 500000)
        assert.throws(() => account.withdraw(0), /amount/i)
    })

    it('Rejects a negative amount', () => {
        const account = new Account("1111234522226789", 500000)
        assert.throws(() => account.withdraw(-100), /amount/i)
    })
})

describe('Account.deposit', () => {

    it('Increases the balance by exactly the amount', () => {
        const account = new Account("1111234522226789", 500000)
        account.deposit(2560)
        assert.strictEqual(account.balance, 502560)
    })

    it('Rejects a zero amount', () => {
        const account = new Account("1111234522226789", 500000)
        assert.throws(() => account.deposit(0), /amount/i)
    })

    it('Rejects a negative amount', () => {
        const account = new Account("1111234522226789", 500000)
        assert.throws(() => account.deposit(-100), /amount/i)
    })
})