export interface Iuser {
    id?: string;
    name: string;
    email: string;
    password: string;
    profilePicture: string
    role: string
}

export interface Iproduct {
    id?: string;
    name: string;
    description: string;
    productimage: string;
    price: number;
    stock: number;
    category: string;
    owner: string;
}

export interface Icategory {
    id?: string;
    name: string;
    description: string;
}

export interface Icoupon {
    id?: string;
    code: string;
    type: string;
    discountValue: number;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    usageLimit: 100;
    conditions: [
        {
            conditionType: string;
            conditionValue: 50,
            project_id? : string;
            category_id? : string;
        }
    ],
    payableprice?:number

}