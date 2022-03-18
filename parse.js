// GraphAPI
// https://thegraph.com/explorer/subgraph?id=JBnWrv9pvBvSi2pUZzba3VweGBTde6s44QvsDABP47Gt&view=Playground
// {
//   cardTypes(where: {name: "Curio1"}) {
//     name
//     supply
//     balances (first: 1000) {
//       user {id}
//       type {name}
//       wrappedBalance
//       unwrappedBalance
//     }
//   }
// }

// run as 'node parse.js'
const subgraphOutput = require('./subgraph-json.json');

const nameTop = subgraphOutput.data.cardTypes[0].name;
const supplyTop = parseInt(subgraphOutput.data.cardTypes[0].supply);
const holderAmountTop = subgraphOutput.data.cardTypes[0].balances.length;
const balancesArray = subgraphOutput.data.cardTypes[0].balances;

let holders = [];
let holderCount = 0;
let supplyCount = 0;

balancesArray.forEach(balance => {
    // console.log(balance.type)
    if (balance.type.name != nameTop) {
        console.log("Error in Graph output");
        return;
    }

    let holder = {
        cardId: balance.type.name,
        address: balance.user.id,
        balance: parseInt(balance.unwrappedBalance) + parseInt(balance.wrappedBalance),
        unwrappedBalance: parseInt(balance.unwrappedBalance),
        wrappedBalance: parseInt(balance.wrappedBalance)

    };
    holders.push(holder);
    holderCount += 1;
    supplyCount += holder.balance;

});

// Debug info
// console.log(`Top Level Name: ${nameTop}`);
// console.log(`Top Level Supply: ${supplyTop}`);
// console.log(`Number of Holders: ${holderAmountTop}`);
// console.log(`Counted Supply: ${supplyCount}`);
// console.log(`Counted Holders: ${holderCount}`);

// Sort holders by balance
holders = holders.sort((a, b) => b.balance - a.balance);
// console.log(holders.slice(0,10));

// Check if the summary data given at the top matches the data in the balances array
if (holderCount == holderAmountTop && supplyCount == supplyTop) {

    // Convert to csv for output
    const holderCSV = [
        [
            "Card ID",
            "Address",
            "Balance",
            "Unwrapped Balance",
            "Wrapped Balance"
        ],
        ...holders.map(holder => [
            holder.cardId,
            holder.address,
            holder.balance,
            holder.unwrappedBalance,
            holder.wrappedBalance
        ])
    ].map(e => e.join(",")).join("\n");

    // Output CSV of the card holders
    // console.log(holderCSV);
    fs = require('fs');
    fs.writeFile('card_holders.csv', holderCSV, function (err) {
        if (err) return console.log(err);
        console.log('csv output written to file');
    });
}