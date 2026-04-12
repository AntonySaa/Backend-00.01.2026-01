console.log("Inicio de la aplicacion");
console.log("Inicio de la con nodemon");

let bandera: boolean = true;

bandera = false;

let nombre: string = "Roberto";

let edad: Number = 43;

let apellido = "Pineda";

let estadoCivil: any = {causa:"Es complicado"};

estadoCivil = "Casado";

estadoCivil = 0;

let vidaSocial: unknown = "Tengo muchos amigos"

let perro: null;

const names: string[] = [];
names.push("juan")
//names.push(33);

const namesRO: readonly string[] = ["Dylan"];
//namesRO.push
const numbers = [1, 2, 3];

let ourTuple: [number, boolean, string];
ourTuple = [5, false, 'Coding God was here'];

const car: { type: string, model: string, year: number } = {
  type: "Toyota",
  model: "Corolla",
  year: 2009
};

const car2: { type: string, mileage?: number } = { // no error
  type: "Toyota"
};
car2.mileage = 2000;

enum CardinalDirections {
  North,
  East,
  South,
  West
}
let currentDirection = CardinalDirections.East;
// logs 0
console.log(currentDirection);
// throws error as 'North' is not a valid enum
//currentDirection = 'North'; // Error: "North" is not assignable to type 'CardinalDirections'.

enum StatusCodes {
  NotFound = 404,
  Success = 200,
  Accepted = 202,
  BadRequest = 400
}
// logs 404
console.log(StatusCodes.NotFound);
// logs 200
console.log(StatusCodes.Success);

type CarYear = number
type CarType = string
type CarModel = string
type Car = {
  year: CarYear,
  type: CarType,
  model: CarModel
}

const carYear: CarYear = 2001
const carType: CarType = "Toyota"
const carModel: CarModel = "Corolla"
const car33: Car = {
  year: carYear,
  type: carType,
  model: carModel
};

interface Rectangle {
  height: number,
  width: number
}

const rectangle: Rectangle = {
  height: 20,
  width: 10
};

interface ColoredRectangle extends Rectangle {
  color: string
}

const coloredRectangle: ColoredRectangle = {
  height: 20,
  width: 10,
  color: "red"
};

function getTime(): number {
  return new Date().getTime();
}

const fecha1: number = getTime();

function printHello(): void {
  console.log('Hello!');
}

printHello();


function add(a: number, b: number, c?: number) {
  return a + b + (c || 0);
}

function pow(value: number, exponent: number = 10) {
  return value ** exponent;
}
console.log(pow(3,3));
console.log(pow(3));
console.log(add(3,4));



function divide({ dividend, divisor }: { dividend: number, divisor: number }) {
  return dividend / divisor;
}
console.log(divide({dividend:33, divisor:44}));

function addPulos(a: number, b: number, ...rest: number[]) {
  return a + b + rest.reduce((p, c) => p + c, 0);
}
console.log(addPulos(5,9,6,6,2,5));

let x: unknown = 'hello';
console.log((<string>x).length);

class Person{
     public name: string;
   private  age: number;
    constructor(name:string, age:number){
        this.name = name;;
        this.age = age;

    }
    
    public get Age() : number {
        return this.age;
    }
     
    public set Age(v : number) {
        this.age = v;
    }
    
}

let persn = new Person("Roberto", 44);

persn.name;
persn.Age = 44;
console.log(persn.Age);


class Person2 {
  // name is a private member variable
  public constructor(private name: string) {}

  public getName(): string {
    return this.name;
  }
}

const person = new Person2("Jane");
console.log(person.getName());