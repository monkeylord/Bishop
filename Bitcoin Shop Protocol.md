### Abstract 

This protocol describes how merchant and customer interact on chain, enabling ALL-ON-CHAIN commerce.

### Motivation

Currently, transactions on bitcoin is only act as a method of payment.

However, in metanet approach, bitcoin(SV) transfers both data and money on TX, which can natively host shops.

Thus, we do not need HTTP server to build shops. [BIP-70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) is out of date.

The necessary aspect of commodity, such as description/negotiation/payment/delivery/arbitrament can be build on chain natively.

A couple of motivating use cases:

+ An independent software developer want to sell and distribute Activation Keys. Traditionally he need official selling page, worldwide payment channels and reliable Key delivery, those are costly and sometimes insecure. 
+ One want to sell encrypted files such as digital-art, document, tools, etc. Traditionally he need to handle payment and deliver decrypt key manually.
+ A personal seller who want to sell one thing or two globally.

### Specification

There are two kinds of approach: native and enhanced.

Native Approach uses TX as protocol without second-layer. Certain rules are recommended but not enforced in Native Approach. 

Enhanced Approach adds second-layer to make shop search-able, indexable and third-party friendly.

#### Native Approach

Typically there are two participants in this approach: merchant and customer.

They settle payment and delivery in two transactions: payment and reply.

In the payment transaction, customer should specify order, receive address and refund address along with correct payment.

In reply transaction, merchant should put commodity or receipt in OP_RETURN output with ECIES encryption. 

if something goes wrong, merchant should reject payment by refunding with message. The refunding message is also used as a way for customer to check if merchant is available.

##### payment transaction

Inputs rules:

1、There should be at least 1 P2PKH input in the transaction.

2、The address of first P2PKH input is customer's receive address.

3、The Public Key contained in the first P2PKH input script is to be used as ECIES public key.

4、If the input's nSequence is not final(FF), the transaction should be considered as intention, and should not be considered as a valid payment until it's mined in a block.

Outputs rules:

1、The first output is OP_RETURN output which specify customer's order. There's no format requirement, but the content should be provided by merchant.

2、The second output should be the payment to merchant.

3、If there is a change output, the change output should be the last output, and whose address should refund address. If there isn't a change output, customer's receive address should be considered as refund address.

##### reply transaction

If it's a **delivery transaction**:

Inputs rules:

1、Merchant should use customer's payment UTXOs as inputs.

Outputs rules:

1、The first output is OP_RETURN output which contains commodity or receipt encrypted with ECIES public key provided by customer.

2、The second output should a minimal payment(546 satoshis for now) to customer's receive address, which will inform the customer.

3、The third output is a payment to merchant's storage(cold wallet) address.

If it's a **refund transaction**:

Inputs rules:

1、Merchant should use customer's payment UTXOs as inputs.

2、As refund, the inputs' nSequence may not be final(FF), and a timelock is recommended, for future correction.

Outputs rules:

1、The first output is OP_RETURN output which specify the refund detail.

2、The second output should be the refund.

##### other rules

1、You should not use shop address for storage, if there is a non-dust P2PKH UTXO on the shop address, the shop should be considered busy.

2、The delivery transaction fee is considered included in price.

3、The refund transaction fee should be paid by customer. (refund amount = payment - fee)

4、Any invalid payment should be replied with refund transaction unless it cannot be replied. The replying also act as "I'm available".

5、Shop owner use shop address pay to shop address TX to add/update shop description. 

#### Enhanced Approach

TODO

PR welcomed.

### Messages

TODO

PR welcomed.

### Implementation

TODO

PR welcomed.

### See Also

[BIP-70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki)

nSequence

ECIES