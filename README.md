# ZK-Whistleblower

A zero-knowledge whistleblower application that allows authenticated users to submit and view anonymous complaints.

## Overview

This application uses zero-knowledge proofs to authenticate users while preserving their anonymity. Users with valid private keys can access the system to view existing alerts or submit new ones.

## Project Structure

- `contracts/`: Contains the zero-knowledge cryptography implementation
- `ui/`: Contains the Svelte-based user interface

## How to Launch the UI

To run the ZK-Whistleblower application:

1. Navigate to the UI directory:
   ```bash
   cd ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Start the development server:
   ```bash
   npm run dev
   ```
   
4. Open the application in your browser:
   ```bash
   npm run dev -- --open
   ```
   
   Or manually open [http://localhost:5173](http://localhost:5173) in your browser.

## Authentication

The system comes pre-configured with 5 authorized user private keys. To authenticate, enter one of the following private keys in the authentication screen:

| User | Private Key |
|------|------------|
| 1    | 619918     |
| 2    | 833853     |
| 3    | 456346     |
| 4    | 438389     |
| 5    | 310299     |

Once authenticated, you can:
- View existing alerts submitted by other whistleblowers
- Submit new anonymous alerts

## How It Works

1. The system uses Poseidon hash commitments for authentication
2. Each private key is hashed and compared against a list of valid commitments
3. Successful verification grants access to the alerts system
4. All actions taken after authentication remain anonymous

## Development

### Contracts

To work with the zero-knowledge contracts:

```bash
cd contracts
npm install
```

### Generating New Keys

To generate new authentication keys, run:

```bash
cd contracts
npx tsx src/generateMultipleKeys.ts
```
