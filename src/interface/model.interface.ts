export interface Iuser {
    id? : string,
    name: string,
    email: string,
    password: string,
    profilePicture : string
    role : string
}

export interface Iproduct{
    id? : string,
    name: string,
    description : string, 
    productimage : string,
    price : number,
    stock : number,
    category : string,
    owner : string,
}

export interface Icategory {
    id? : string,
    name: string,
    description : string,
}