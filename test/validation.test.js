import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateAccountNumber, validateAmount } from "../src/validation.js";

describe('validateAccountNumber', () => {

    it('Accepts a valid 16-digit account number', () => {
        assert.doesNotThrow(() => validateAccountNumber("1111234522226789"));
    });

    it('Accepts an account number with a leading zero', () => {
        assert.doesNotThrow(() => validateAccountNumber("0111234522226789"));
    });

    it('Rejects null as required', () => {
        assert.throws(() => validateAccountNumber(null), /account number is required/i);
    });

    it('Rejects undefined as required', () => {
        assert.throws(() => validateAccountNumber(undefined), /account number is required/i);
    });

    it('Rejects an account number shorter than 16 digits', () => {
        assert.throws(() => validateAccountNumber("123"), /16-digit/i);
    });

    it('Rejects an account number longer than 16 digits', () => {
        assert.throws(() => validateAccountNumber("11112345222267890"), /16-digit/i);
    });

    it('Rejects an account number containing letters', () => {
        assert.throws(() => validateAccountNumber("11112345222267ab"), /16-digit/i);
    });

    it('Rejects an account number that is a number', () => {
        assert.throws(() => validateAccountNumber(1111234522226789), /16-digit/i);
    });
});

describe('validateAmount', () => {

    it('Accepts a positive whole number of cents', () => {
        assert.doesNotThrow(() => validateAmount(50000));
    });

    it('Rejects null as required', () => {
        assert.throws(() => validateAmount(null), /amount is required/i);
    });

    it('Rejects undefined as required', () => {
        assert.throws(() => validateAmount(undefined), /amount is required/i);
    });

    it('Rejects zero', () => {
        assert.throws(() => validateAmount(0), /amount/i);
    });

    it('Rejects a negative amount', () => {
        assert.throws(() => validateAmount(-100), /amount/i);
    });

    it('Rejects an amount that is a string', () => {
        assert.throws(() => validateAmount("100"), /amount/i);
    });

    it('Rejects an amount that is not a whole number of cents', () => {
        assert.throws(() => validateAmount(100.5), /amount/i);
    });
});
