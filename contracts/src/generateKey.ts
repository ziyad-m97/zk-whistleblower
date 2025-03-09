import { Field, Poseidon } from 'o1js';

function generateKey() {
    // Generate a random number for private key
    const privateKey = Math.floor(Math.random() * 1000000).toString();
    const privateKeyField = Field(privateKey);
    const commitment = Poseidon.hash([privateKeyField]);

    return {
        privateKey,
        commitment: commitment.toString()
    };
}

const { privateKey, commitment } = generateKey();
console.log('Generated Private Key:', privateKey);
console.log('Commitment:', commitment);
