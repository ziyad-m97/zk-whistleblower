import { Field, Poseidon } from 'o1js';
import * as fs from 'fs';

function generateRandomPrivateKey() {
  // Generate a random number between 10000 and 999999
  return Math.floor(Math.random() * 990000 + 10000).toString();
}

function computeCommitment(privateKeyStr: string) {
  const privateKeyField = Field(privateKeyStr);
  return Poseidon.hash([privateKeyField]).toString();
}

// Generate 5 different keys and commitments
const keys = [];
const commitments = [];

for (let i = 0; i < 5; i++) {
  const privateKey = generateRandomPrivateKey();
  const commitment = computeCommitment(privateKey);
  
  keys.push(privateKey);
  commitments.push(commitment);
  
  console.log(`User ${i+1}:`);
  console.log(`Private Key: ${privateKey}`);
  console.log(`Commitment: ${commitment}`);
  console.log('-----------------');
}

// Create JSON data for export
const keyData = {
  keys,
  commitments
};

// Write to JSON file
fs.writeFileSync('keyData.json', JSON.stringify(keyData, null, 2));
console.log('Keys and commitments saved to keyData.json');
