const num = document.querySelector("input#Cnum");
const pin = document.querySelector("input#pin");
const submit = document.querySelector("input#submit");

const action = document.querySelector(".actions");

const namo = document.querySelector("input#namo");
const crnum = document.querySelector("input#newCnum");
const crpin = document.querySelector("input#newpin");
const crsubmit = document.querySelector("input#newsubmit");

const data = document.querySelector("#data");
console.log(num);
let loggedin = false;
let accountnum = -1;

let logins = JSON.parse(localStorage.getItem("logins")) || [
    {
        name:"Test case",
        cardNumber:1000,
        pin:1,
        accounts:[
            {
                type:"Checking",
                amount:400.52,
                currency:"USD"
            },
            {
                type:"Share Savings",
                amount:1001.10,
                currency:"CAD"
            }
        ]
    }
];

function createDepositFunction(num,id){
    return function(amount){
        console.log(`num ${num}, id ${id}, amount ${Number(amount)}, isnumber? ${Number.isInteger(Number(amount))}`);
        logins[num].accounts[id].amount+=Number(amount);
    }
}

function save () {
    localStorage.setItem("logins",JSON.stringify(logins));
    console.log("saved");
}

function logIn(num,pin){
    let loggedIn = false;
    let accountNum = -1;
    logins.forEach((e,i) => {
        if(Number(num)===e.cardNumber && Number(pin)===e.pin)
        {
            console.log("Login Successful for account #"+i);
            accountNum=i;
            loggedIn=true;
            return;
        }
    });
    if(loggedIn)
    {
        alert("Welcome to Bank");
        accountnum=accountNum;
        loggedin=true;
        load();
    } else {
        alert("Error: Account not found");
    }
}
function createAccount(name,num,pin) {
    alert("Account Created");
    return {
        "name":name,
        "cardNumber":Number(num),
        "pin":Number(pin),
        "accounts":[
            {"type":"Checking","amount":0,"currency":"USD"},
            {"type":"Share Savings","amount":0,"currency":"USD"}
        ]
    };
}

function load () {
    if(accountnum == -1 || !loggedin)
        return;
    data.innerHTML = `
        <h3>${logins[accountnum].name}</h3>
        <h4>Card number ...${String(logins[accountnum].cardNumber)[String(logins[accountnum].cardNumber).length-1]}</h4>
        <div class="accounts">
            ${
                logins[accountnum].accounts.map((e,i)=>{
                    return `
                        <div class="account" id="e${i}">
                            <h4>${e.type}</h4>
                            <h3>$${e.amount}</h3>
                            <h4>${e.currency}</h4>
                        </div>
                    `;
                })
            }
        </div>
    `;
    logins[accountnum].accounts.forEach((e,i)=>{
        let butte = document.createElement("input");
        let amount = document.querySelector("#amount");
        butte.type = "button";
        butte.value = "Change "+e.type+" amount";
        let g = createDepositFunction(accountnum,i);
        butte.addEventListener("click",()=>{
            g(amount.value);
            load();
            save();
        });
        document.querySelector(`#e${i}`).append(butte);
    })
    console.log("Loaded");
}


submit.addEventListener("click",e=>{
    logIn(num.value,pin.value);
    num.value="";
    pin.value=null;
});
crsubmit.addEventListener("click",e=>{
    if(!namo.value||!crnum.value||!crpin.value)
        return;
    logins.push(createAccount(namo.value,crnum.value,crpin.value));
    save();
})