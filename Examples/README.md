## Shop Example

### A Simple Shop

A simple shop that retrieve PK from Payment and deliver Digital Commdity in ECIES encryption though TX.

The shop code can be ran on any device accessed to bitcoin network, which means you do not need a IP address.

TX is routed anonymous.

Commodity can only be retrieved by the Buyer

~~~javascript
const bsv = require('bsv')
const SimpleShop=require('./SimpleShop.js')
const ECIES = require('electrum-ecies')

const Transaction = bsv.Transaction
const PublicKey = bsv.PublicKey


//Fetch TX from somewhere. Electrum Node or BitDB or other RPC point
//It should be a payment to shop address

//var testPaymentTX=new bsv.Transaction('01000000013216d667c54d6d3f95b054084a17bacccb7cdcc43f1caf838b8a40183b62e2eb000000006a473044022020d11e4db8bf59d221e97d167d9fbf845d9f3ed094b33c9c7e458b06341ed23e02203b91f540d794e53856fa62d0f7b097bee47350db1cd73d14e4341d7b5e6b3c2b41210374d0fca0d78a13b8eb0edff0b2c434a7bd8ee96c9efc767489f3577928e67ad8feffffff0300000000000000000f6a0d54686973206973206120747279a0860100000000001976a91470d57479627e3b77847648a873dff945bfdeb95488ac263a9500000000001976a91461f61eb7233157bad8111b96066d9e0fed87029788ac47870800')

//Config The Shop
var shopConfig = {
    'ShopAddress':'1BHcPbcjRZ9ZJvAtr9nd4EQ4HbsUC77WDf', //Shop Address which buyer should pay to
    'StorageAddress':'19VxNbLGfbXV6UENGSkWmJTQeNLWqqJGaz',  //Cold Wallet Address
    'FeePerKb':1024
}

//Define Commodity Provider
var getCommodity = function (order){
    //Write your code
    return "Your Commodity:"+order
}

//Define Payment Validator
var isVaild = function(tx){
    //You Should Validate Payment Amount / Non-P2PKH TX
    //If return false, A refund TX will be build instead of Deliver TX
    return true
}

//Do the Config
SimpleShop.config(shopConfig,getCommodity,isVaild)

//Then Handle The TX
var ReplyTX = SimpleShop.handlePayment(testPaymentTX)
console.log(ReplyTX)

//Then Broadcast the ReplyTX, Electrum Node or BitDB or other RPC point
var SignedTX = ReplyTX.sign([Your Shop Address Private Key])
console.log(SignedTX)

~~~

