# how to encrypt account balances in a PoS system

# assumptions

1) using the banano blockchain as an example, each transaction requires two blocks. one send block and one receive block. Each transaction is validated by one or more representatives.

1.1) to validate a send block, the representatives must verify that the value in a send block[S] is not greater than the value in the account's previous receive block[A1].

1.1.1) S>=A1

1.2) to validate a receive block, the representatives must verify that the value in a receive block[R] is equal to the the value in the account's previous receive block[A2] plus the sent amount.

1.2.1) (S-A1=(amount sent)=A2+S)

2) each representative is set up with camo banano.  I.E. the representative's representative field is set to a junk rep that is really it's ECDH public key.

# process

1.1) to encrypt the amount in both send and receive blocks, the sender follows this process:

1.1.1) find the top 4 reps by weight. call them representatives A,B,C,D. sort them alphabetically by account name.

1.1.2) split the amount field into 4 parts. ie. 0.219 becomes "0","2","1","9". In reality they would split the byte array into four parts. Using decimal amounts is just good for illustration purposes.

1.1.3) encrypt each part, so only the representative can decrypt it.

1.1.3.1) compute a bitmask by taking the blake hash of (ECDH shared secret + prev blockhash).

1.1.3.2) XOR the bitmask with the amount part.

1.1.3.3) for redundancy, encrypt 2 parts for each rep.
        rep A would get "0","2"
        rep B would get "2","1"
        rep C would get "1","9"
        rep D would get "9","0"

1.2) to verify the amount in a send block

1.2.1) the rep decrypts the amount in the send block using the bitmask from 1.1.3.1

1.2.2) the rep decrypts the amount in the previous block using the bitmask from 1.1.3.1 (this is why reps need to be stable, they need to decrypt the previous block)

1.2.3.1) the rep confirms that their part of the send block's amount is less than or equal to the previous block's amount. So the send block is valid.

1.2.3.1.1) the rep says if they need a carry bit for their part to be valid.

1.2.3.1.2) the rep says if their part sets the carry bit.
        this does expose the carry bit of the real amount, so it's important not to have too many parts, or too many carry bits will be exposed.

1.2.3.1.3) if all reps say their amounts are valid, the send block is valid.

1.3) to verify the amount in a receive block.

1.3.1) the rep decrypts the amount in the send block using the bitmask from 1.1.3.1

1.3.2) the rep decrypts the amount in the previous block using the bitmask from 1.3.3.1 (this is why reps need to be stable, they need to decrypt the previous block)

1.3.3.1) the rep confirms that their part of the receive block's amount is equal to the previous block's amount plus (the send block's amount minus the sender's previous block's amount). So the receive  block is valid.

1.3.3.1.1) the rep says if they need a carry bit for their part to be valid.

1.3.3.1.2) the rep says if their part sets the carry bit.
        this does expose the carry bit of the real amount, so it's important not to have too many parts, or too many carry bits will be exposed.

1.3.3.1.3) if all reps say their amounts are valid, the receive block is valid.
