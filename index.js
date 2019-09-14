var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var StellarSdk = require('stellar-sdk')

var server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
StellarSdk.Network.useTestNetwork()
var app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));  

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/hello', function(req, res){
    console.log('hit')
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get('/balance/:accountId', function(req, res){
    var accountId = req.params.accountId;
    console.log(accountId)
    server.accounts()
        .accountId(accountId)
        .call()
        .then(function (accountResult) {
            res.send({balance: accountResult.balances[0].balance})
            // console.log(accountResult.balances[0].balance);
        })
        .catch(function (err) {
            console.error(err);
        })
});

app.post('/payment/', function(req, res){
    var sourceSecretKey = String(req.body.sourceSecretKey);
    var destinationKey = String(req.body.destinationKey);
    var amount = String(req.body.amount);
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
    const sourcePublicKey = sourceKeypair.publicKey();
    (async function main(){
        const account = await server.loadAccount(sourcePublicKey);
        const fee = await server.fetchBaseFee();
        const transaction = new StellarSdk.TransactionBuilder(account, { fee })
        .addOperation(StellarSdk.Operation.payment({
            destination: destinationKey,
            asset: StellarSdk.Asset.native(),
            amount: amount,
        }))
        .setTimeout(30)
        .build();
        transaction.sign(sourceKeypair);
        try{
            const transactionResult = await server.submitTransaction(transaction);
            const response_data = {
                status: 'Success',
                link: transactionResult._links.transaction.href,
            }
            res.send(JSON.stringify(response_data))
        } catch (e) {
            console.log('An error has occured:');
            console.log(e);
            res.send(error)
        }
    })();
})

// app.listen(3000, function(){
//     console.log('Server Started on Port 3000...');
// });

// const StellarSdk = require('stellar-sdk')
// const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// const pair = StellarSdk.Keypair.random();
// pair.secret();
// pair.publicKey();

// const StellarSdk = require('stellar-sdk')
// StellarSdk.Network.useTestNetwork();
// const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// (async function main() {
//     const account = await server.loadAccount(publicKey);

//     /* 
//         Right now, we have one function that fetches the base fee.
//         In the future, we'll have functions that are smarter about suggesting fees,
//         e.g.: `fetchCheapFee`, `fetchAverageFee`, `fetchPriorityFee`, etc.
//     */
//     const fee = await server.fetchBaseFee();

//     const transaction = new StellarSdk.TransactionBuilder(account, { fee })
//         .addOperation(
//             // this operation funds the new account with XLM
//             StellarSdk.Operation.payment({
//                 destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
//                 asset: StellarSdk.Asset.native(),
//                 amount: "200"
//             })
//         )
//         .setTimeout(30)
//         .build();

//     // sign the transaction
//     transaction.sign(StellarSdk.Keypair.fromSecret(secretString)); 

//     try {
//         const transactionResult = await server.submitTransaction(transaction);
//         console.log(transactionResult);
//     } catch (err) {
//         console.error(err);
//     }
// })()

// var StellarSdk = require('stellar-sdk');
// // const sourceSecretKey = 'SDRWTET7AWC74VGIMRGYV5Q233EXGFFFS4SSXDNV7I2CD43ZTYDJXXGW';
// // const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
// // const sourcePublicKey = sourceKeypair.publicKey();
// // const receiverPublicKey = 'GAIRISXKPLOWZBMFRPU5XRGUUX3VMA3ZEWKBM5MSNRU3CHV6P4PYZ74D';
// var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
// // StellarSdk.Network.useTestNetwork();

// // (async function main() {
    // const account = await server.loadAccount(sourcePublicKey);
    // const fee = await server.fetchBaseFee();
    // const transaction = new StellarSdk.TransactionBuilder(account, { fee })
    // .addOperation(StellarSdk.Operation.payment({
    //     destination: receiverPublicKey,
    //     asset: StellarSdk.Asset.native(),
    //     amount: '150.0000000',
    // }))
    // .setTimeout(30)
    // .build();
    // transaction.sign(sourceKeypair);
    // console.log(transaction.toEnvelope().toXDR('base64'));
    // try{
    //     const transactionResult = await server.submitTransaction(transaction);
    //     console.log(JSON.stringify(transactionResult, null, 2));
    //     console.log('\nSuccess! View the transaction at: ');
    //     console.log(transactionResult._links.transaction.href);
    // } catch (e) {
    //     console.log('An error has occured:');
    //     console.log(e);
    // }
// // })();


// server.accounts()
//   .accountId("GC2GHLJTWJXKIGMT55BC4Y77SOJ3ND63BPDY6XMY2KRPJU2ZIMOSWXTB")
//   .call()
//   .then(function (accountResult) {
//     console.log(accountResult.balances[0].balance);
//   })
//   .catch(function (err) {
//     console.error(err);
//   })