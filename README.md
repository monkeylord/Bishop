# Bishop
This project is to build shops on Bitcoin.

Bitcoin(SV) metanet transfers both data and money on TX, which can natively host shops.

Shop host on bitcoin will be

Serverless
Anonymous
Worldwide
Easy

## Develop Plan
1. A Simple Shop Demo.
2. E-commercial protocol.
3. A Full Shop implement.

## Simple Shop Logic
~~~mermaid
sequenceDiagram
participant Buyer
participant Seller
participant E-Commodity
Buyer->>Seller: P2PkH with OP_RETRUN Message
Seller-->E-Commodity: Fetch E-Commodity
Seller->>Buyer: E-Commodity Encrypted in Buyer's Public Key(ECIES)
note left of Buyer: Decrypt and Get E-Commodity
Seller-->>Buyer: Refund if something goes wrong
~~~

The Payment is no different from other TX.

The Encrypted E-Commodity can be decrypted with decent wallet.(Electrion Cash->Tools->Encrypt/Decrypt)

ECIES lib: [js](https://github.com/monkeylord/electrum-ecies)
