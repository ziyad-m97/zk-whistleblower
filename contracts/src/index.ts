import { Mina, PrivateKey, PublicKey, Field, MerkleTree } from 'o1js';
import { WhistleblowingZkApp } from './SubmitComplaint.js';
import { IdentityMerkleWitness, computeIdentityCommitment } from './VerifyUser.js';
import fs from 'fs';

// Setup local Mina blockchain
const Local = Mina.LocalBlockchain({ proofsEnabled: true });
Mina.setActiveInstance(Local);
const deployerAccount = Local.testAccounts[0];
const deployerKey = deployerAccount.privateKey;

// Allowed users
const ALLOWED_PUBLIC_KEYS: PublicKey[] = [
  Local.testAccounts[1].publicKey,
  Local.testAccounts[2].publicKey
];

// Generate commitments
let allowedCommitments: Field[] = [];
let privateKeyMap: Map<PublicKey, PrivateKey> = new Map();
ALLOWED_PUBLIC_KEYS.forEach((pub, idx) => {
  const priv = Local.testAccounts[idx+1].privateKey;
  privateKeyMap.set(pub, priv);
  const privField = priv.toFields()[0];
  const commitment = computeIdentityCommitment(privField);
  allowedCommitments.push(commitment);
});

// Build Merkle tree
const tree = new MerkleTree(8);
allowedCommitments.forEach((commitment, index) => {
  tree.setLeaf(BigInt(index), commitment);
});
const root = tree.getRoot();

// Deploy contract
const zkAppKey = PrivateKey.random();
const zkAppAddress = zkAppKey.toPublicKey();
const zkAppInstance = new WhistleblowingZkApp(zkAppAddress);

await WhistleblowingZkApp.compile();
let deployTx = await Mina.transaction(deployerAccount.publicKey, () => {
  Mina.accountCreationFee().mul(1);
  zkAppInstance.deploy({ zkappKey: zkAppKey });
  zkAppInstance.init();
});
await deployTx.prove();
await deployTx.sign([deployerKey, zkAppKey]).send();

// ✅ Set allowed users root after deployment
let setRootTx = await Mina.transaction(deployerAccount.publicKey, () => {
  zkAppInstance.setAllowedUsersRoot(root);
});
await setRootTx.prove();
await setRootTx.sign([deployerKey]).send();

// ✅ Function to submit a complaint
async function submitComplaint(userPubKey: PublicKey, complaintText: string) {
  const userPrivKey = privateKeyMap.get(userPubKey);
  if (!userPrivKey) {
    throw new Error('User is not in the allowed list');
  }
  const userSecret = userPrivKey.toFields()[0];
  const userCommitment = computeIdentityCommitment(userSecret);

  const idx = allowedCommitments.findIndex(c => c.equals(userCommitment).toBoolean());
  if (idx < 0) {
    throw new Error('Commitment not found in allowed list');
  }

  // ✅ Generate valid Merkle witness
  const witness = new IdentityMerkleWitness(tree.getWitness(BigInt(idx)));

  const tx = await Mina.transaction(deployerAccount.publicKey, () => {
    zkAppInstance.submitComplaint(userSecret, witness, Field(0));
  });
  await tx.prove();
  await tx.sign([deployerKey]).send();

  // ✅ Store complaint in JSON file
  const record = {
    timestamp: new Date().toISOString(),
    from: userPubKey.toBase58(),
    complaint: complaintText
  };
  let complaints = [];
  try {
    const data = fs.readFileSync('storage/complaints.json', 'utf8');
    complaints = JSON.parse(data);
  } catch (e) {
    complaints = [];
  }
  complaints.push(record);
  fs.writeFileSync('storage/complaints.json', JSON.stringify(complaints, null, 2));
  console.log('Complaint submitted anonymously.');
}

// ✅ Test submission
await submitComplaint(ALLOWED_PUBLIC_KEYS[0], "Something is wrong in the company...");