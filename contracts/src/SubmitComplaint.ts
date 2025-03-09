import { SmartContract, state, State, method, Field, Poseidon } from 'o1js';
import { IdentityMerkleWitness } from './VerifyUser.js';

export class WhistleblowingZkApp extends SmartContract {
  @state(Field) allowedUsersRoot = State<Field>();
  

  @method init() {
    // ✅ Initialize the Merkle root to 0
    super.init();
    this.allowedUsersRoot.set(Field(0));
  }

  @method setAllowedUsersRoot(newRoot: Field) {
    const currentRoot = this.allowedUsersRoot.get();
    this.allowedUsersRoot.assertEquals(currentRoot);
    this.allowedUsersRoot.set(newRoot);
  }

  // ✅ Utilise directement IdentityMerkleWitness comme type
  @method submitComplaint(userSecret: Field, merklePath: IdentityMerkleWitness, complaintHash: Field) {
    const root = this.allowedUsersRoot.get();
    this.allowedUsersRoot.assertEquals(root);

    const identityCommitment = Poseidon.hash([userSecret]);
    merklePath.calculateRoot(identityCommitment).assertEquals(root);

    console.log("Complaint submitted successfully!");
  }
}


export { WhistleblowingZkApp };
