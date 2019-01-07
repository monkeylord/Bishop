var Transaction=require('bsv').Transaction;
var Address=require('bsv').Address;
var shopConfig=null;
var isVaild=function(tx){return true};
var getCommodity=null;

var getPublicKeyInPublicKeyHashIn=function(input){
    if(input.script.isPublicKeyHashIn()==false)throw new Error("Not PublicKeyHashIn")
    var script=input.script.toBuffer();
    var pubkey=script.subarray(script.length-33,script.length);
    return pubkey;
}

var getMsg=function(tx){
    var outputs=Transaction(tx).outputs;
    for (var i = 0; i < outputs.length; i) {  
        if(outputs[i].script.isDataOut())return outputs[i].script.toBuffer().subarray(2)
    }
    return new Buffer();
}

var getFirstPayment=function(tx,address){
    var outputs=Transaction(tx).outputs;
    for (var i = 0; i < outputs.length; i++) {  
        if(outputs[i].script.toAddress().toString()==new Address(address).toString())return i;
    }
    return null;
}

var getFirstPKHInput=function(tx){
    var inputs=Transaction(tx).inputs;
    for (var i = 0; i < inputs.length; i) {  
        if(inputs[i].script.isPublicKeyHashIn())return inputs[i];
    }
    return null;
}

var buildRefundTX = function (tx,buyerPK){
    var paymentIndex = getFirstPayment(tx,shopConfig.ShopAddress)
    var utxo = {
        "txId" : tx.hash,
        "outputIndex" : paymentIndex,
        "address" : shopConfig.ShopAddress,
        "script" : tx.outputs[paymentIndex].script,
        "satoshis" : tx.outputs[paymentIndex].satoshis
    }
    var refundTX = new Transaction()
                    .from(utxo).addData(ECIES.encrypt('Refund',buyerPK))
                    .change(new PublicKey(buyerPK).toAddress())
                    .feePerKb(1024)
    return refundTX
}

var buildDeliverTX = function (tx,buyerPK,commodity){
    var paymentIndex = getFirstPayment(tx,shopConfig.ShopAddress)
    var utxo = {
        "txId" : tx.hash,
        "outputIndex" : paymentIndex,
        "address" : shopConfig.ShopAddress,
        "script" : tx.outputs[paymentIndex].script,
        "satoshis" : tx.outputs[paymentIndex].satoshis
    }
    var deliverTX = new Transaction()
                        .from(utxo).addData(ECIES.encrypt(commodity,buyerPK))
                        .to(new PublicKey(buyerPK).toAddress(),546)//dust limit
                        .change(shopConfig.StorageAddress)
                        .feePerKb(1024)
    return deliverTX
}

var handlePayment = function(tx){
    if(shopConfig==null)throw new Error("shop config first");
    //Get Buyer PublicKey from Payment TX Input
    var firstPKH=getFirstPKHInput(tx)
    var buyerPK=getPublicKeyInPublicKeyHashIn(firstPKH)
    if(isVaild(tx)){
        //Get OP_RETURN content
        var msg=getMsg(tx)
        //Get Commodity according to msg
        var commodity=getCommodity(msg)
        //Build DeliverTX
        return buildDeliverTX(tx,buyerPK,commodity)
    }else{
        return buildRefundTX(tx,buyerPK)
    }
}

var config = function(config,commodityProvider,validator){
    shopConfig=config;
    getCommodity=commodityProvider;
    isVaild=validator;
}

module.exports.getPublicKeyInPublicKeyHashIn=getPublicKeyInPublicKeyHashIn;
module.exports.getFirstPayment=getFirstPayment
module.exports.getFirstPKHInput=getFirstPKHInput;
module.exports.buildRefundTX=buildRefundTX;
module.exports.buildDeliverTX=buildDeliverTX;
module.exports.handlePayment=handlePayment;
module.exports.config=config;