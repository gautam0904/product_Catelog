export  interface IfilterProduct {
    minprice: string;
    maxprice: string;
    maxstock: string;
    minstock: string;
    category: string;
    search : string;
}

export interface Icouponfilter{
    Quantity : number,
    Category : string,
    products : string,
    buyprice : number
}