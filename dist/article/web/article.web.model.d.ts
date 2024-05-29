export declare class ArticleWebResponse {
    status: number;
    devMessage: string;
    userMessage?: string;
}
export declare class CountryInput {
    name: string;
}
export declare class MaterialInput {
    name: string;
    percent: number;
}
export declare class TransportInput {
    name: string;
    percent: number;
}
declare class CountryObject {
    name: string;
}
declare class MaterialObject {
    name: string;
    percent: number;
}
declare class TransportObject {
    name: string;
    percent: number;
}
export declare class ArticleWebObject {
    id: string;
    name: string;
    url: string;
    image: string;
    brand: string;
    price: number;
    country: CountryObject[];
    material: MaterialObject[];
    transport: TransportObject[];
    ethical_score: number;
    ecological_score: number;
    local_score: number;
}
export {};
