import { Field, Poseidon, MerkleWitness } from 'o1js';

// Défini explicitement la hauteur du Merkle tree
const MERKLE_HEIGHT = 8;

// ✅ Export explicite d'une classe héritant de MerkleWitness
export class IdentityMerkleWitness extends MerkleWitness(MERKLE_HEIGHT) {}

// ✅ Fonction calculant l'engagement d'identité
export function computeIdentityCommitment(userSecretField: Field): Field {
  return Poseidon.hash([userSecretField]);
}