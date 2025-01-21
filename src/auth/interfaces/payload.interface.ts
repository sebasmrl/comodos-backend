
export interface Payload{
    id:string;
}

export interface PayloadAfterVerify extends Payload{
    iat:number,
    exp:number
}