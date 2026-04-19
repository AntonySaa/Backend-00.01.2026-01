console.log("Inicio de la aplicacion");
import os from 'node:os';

function calculadora(num1: number, num2: number, mycallback: any): void{
    setTimeout(()=>{
        mycallback(num1+num2);
    },5000)
}

function mycallback(result: number):void{
    console.log(`El resultado es: ${result}`);
}

calculadora(44,55,mycallback);



const myPrommise = new Promise((resolve, reject)=>{
    try {
        setTimeout(()=>{
            resolve("Promesa cumplida");
        },3000);
        //throw new Error("Hubo un error")
    } catch (error) {
        reject(error);
    }
})

myPrommise.then(data=>{
    console.log(data);
}).catch(error=>{
    console.log(error)
});

async function miPromesaAsync() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    await new Promise(r => setTimeout(r, 7000));
    console.log(data);
}
miPromesaAsync();


console.log("Fin de la aplicacion");



// Basic system information
console.log(`OS Platform: ${os.platform()}`);
console.log(`OS Type: ${os.type()}`);
console.log(`OS Release: ${os.release()}`);
console.log(`CPU Architecture: ${os.arch()}`);
console.log(`Hostname: ${os.hostname()}`);

// Memory information
const totalMemGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
const freeMemGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
console.log(`Memory: ${freeMemGB}GB free of ${totalMemGB}GB`);

// User information
const userInfo = os.userInfo();
console.log(`Current User: ${userInfo.username}`);
console.log(`Home Directory: ${os.homedir()}`);

let url = require('url');
let adr = 'http://localhost:8080/default.htm?year=2017&month=february';
let q = url.parse(adr, true);

console.log(q.host);
console.log(q.pathname);
console.log(q.search);

let qdata = q.query;
console.log(qdata.month);


const dns = require('dns');

// Look up a domain name
dns.lookup('www.x-codec.net', (err: any, address: any, family: any) => {
  if (err) {
    console.error('Lookup error:', err);
    return;
  }
  console.log(`IP address: ${address}`);
  console.log(`IP version: IPv${family}`);
});


import assert from 'node:assert';

let total = 0;
let exitos = 0;

function test(fn: () => void) {
    total++;
    try {
        fn();
        exitos++;
    } catch (error: unknown) {
         console.log((error as Error).message);
    }
}

// Tests
test(() => assert.strictEqual(1 + 1, 2));
test(() => assert.strictEqual(2 * 2, 4));
test(() => assert.notStrictEqual(5 - 2, 1)); // ❌ falla

// Cálculo
const porcentaje = (exitos / total) * 100;

console.log(`Total: ${total}`);
console.log(`Exitos: ${exitos}`);
console.log(`Porcentaje de éxito: ${porcentaje.toFixed(2)}%`);


const readline = require('readline');

// Create interface for input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask a question and handle the response
rl.question('What is your name? ', (name: string) => {
  console.log(`Hello, ${name}!`);

  // Ask follow-up question
  rl.question('How old are you? ', (age : string) => {
    console.log(`In 5 years, you'll be ${parseInt(age) + 5} years old.`);

    // Close the interface when done
    rl.close();
  });
});

// Handle application exit
rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
