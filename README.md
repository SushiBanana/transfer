## Overview

- Loads a company's account balances and transactions
- Runs a day's transfers
- Rejects any transfer that would take an account below $0

### Requirements

- Node.js v20 or later

### Project structure

```
.
├── src/
│   ├── index.js          # Entry point: reads the two sample CSVs and prints the report
│   ├── processDay.js     # Runs one day: parses both files, applies the transfers, returns the results
│   ├── bank.js           # Bank: holds the accounts, applies transfers, records failures without stopping the day
│   ├── account.js        # Account: balance in cents, withdraw (refuses to go below $0) and deposit
│   ├── transfer.js       # Transfer: from account, to account and amount, validated on creation
│   ├── validation.js     # Shared checks for 16-digit account numbers and positive cent amounts
│   ├── csv.js            # Parses the CSVs into Accounts and Transfers, converts dollars <-> cents
│   └── formatReport.js   # Formats the results into the printed report
├── test/                 # One test file per module in src/
│   ├── account.test.js
│   ├── bank.test.js
│   ├── csv.test.js
│   ├── formatReport.test.js
│   ├── processDay.test.js
│   ├── transfer.test.js
│   └── validation.test.js
├── MableBackEndCodeTest/
│   ├── MABLE_BACK_END_CODE_TEST.md   # The assessment brief
│   ├── mable_account_balances.csv    # Sample starting balances
│   └── mable_transactions.csv        # Sample day of transfers
└── package.json
```

---

### Getting started

1. Install dependencies

```
npm install
```

2. Run index.js

```
npm start
```

### Example Output

```
Starting balances
  Account             Balance
  1111234522226789    5000.00
  1111234522221234   10000.00
  2222123433331212     550.00
  1212343433335665    1200.00
  3212343433335755   50000.00

Successful transfers
  From              To                   Amount
  1111234522226789  1212343433335665     500.00
  3212343433335755  2222123433331212    1000.00
  3212343433335755  1111234522226789     320.50
  1111234522221234  1212343433335665      25.60

Failed transfers
  (none)

Applied 4 of 4 transfers

Final balances
  Account             Balance
  1111234522226789    4820.50
  1111234522221234    9974.40
  2222123433331212    1550.00
  1212343433335665    1725.60
  3212343433335755   48679.50
```

---

### Running tests

#### Tests

```
npm test
```

#### Coverage

```
npm run coverage
```

#### Linting (optional)

```
npm run lint
```

#### Formatting (optional)

```
npm run format
```

---

### Design decisions

#### Domain models

- `Account`: holds a balance and rejects any withdrawal that would take it below $0
- `Bank`: looks up accounts by number and applies transfers between them
- `Transfer`: a from account, a to account and an amount
- Fields are private and only change through methods like `withdraw` and `deposit`

#### Validation

- `Account` and `Transfer` validate their inputs when created, so invalid objects can't exist
- Shared rules live in `validation.js`

#### Money in cents

- Amounts are stored as whole cents to avoid floating-point rounding errors
- They are converted back to dollars only when the report is printed

#### Account numbers as strings

- Keeps leading zeros and stops them being treated as numbers

#### Processing a day

- Both CSVs are parsed before any transfer runs, so a bad file stops the day before money moves
- Transfers run in file order
- A transfer is all or nothing: every check runs before any balance changes
- A failed transfer is recorded with its reason and skipped, and the rest of the transfers still runs

#### Separation of concerns

- `csv.js` parses, the models hold the rules, `processDay.js` runs the day, `formatReport.js` formats the output
- `index.js` is the only file that reads files or prints to the console

---

### Approach

I took a Test-Driven Development (TDD) approach:

1. Read the brief and sketched out the domain models and their methods
2. Starting with the simplest component, alternated between writing tests first and then the implementation
   - I brainstormed a couple of different edge cases (e.g. a transfer to the same account, a balance of exactly 0 after a transfer)
   - Got Claude to fill in any gaps by generating an overview test table
   - Once verified, asked Claude to write the test cases
3. Built up from there (Account -> Transfer -> Bank -> csv -> processDay -> formatReport)
4. Connected everything in `index.js` last

---

### Assumptions

- One company per run, and CSVs have no header rows
- Account numbers are 16 digits and balances have at most 2 decimal places
- Transfers run in order of the file
- A failed transfer (e.g. insufficient funds, unknown account, same-account transfer) is skipped, but other transfers can proceed
- A malformed CSV or a duplicated account stops all processing

---

### Possible Future Improvements

- Use TypeScript instead of JavaScript, since a lot of test cases were checking types and whether arguments were null
- Use stubs in tests so each component can be tested on its own
