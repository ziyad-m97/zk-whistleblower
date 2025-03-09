import express, { Request, Response } from 'express';
import cors from 'cors';
import { Field } from 'o1js';
import { computeIdentityCommitment } from './VerifyUser';

const app = express();
app.use(cors());
app.use(express.json());

// Store valid identity commitments (in a real app, this would be in a database)
const validIdentityCommitments = new Set<string>();

// Endpoint to register a new private key
app.post('/register', (req: Request, res: Response) => {
    const { privateKey } = req.body;
    try {
        const privateKeyField = Field(privateKey);
        const commitment = computeIdentityCommitment(privateKeyField);
        validIdentityCommitments.add(commitment.toString());
        res.json({ success: true, commitment: commitment.toString() });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Invalid private key format' });
    }
});

// Endpoint to verify a private key
app.post('/verify', (req: Request, res: Response) => {
    const { privateKey } = req.body;
    try {
        const privateKeyField = Field(privateKey);
        const commitment = computeIdentityCommitment(privateKeyField);
        const isValid = validIdentityCommitments.has(commitment.toString());
        res.json({ success: true, isValid });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Invalid private key format' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
