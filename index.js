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
