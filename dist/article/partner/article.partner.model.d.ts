export declare class CriteriaObjectType {
    name: string;
}
export declare class TransportObjectType {
    name: string;
    percent: number;
}
export declare class CriteriaInputType {
    name: string;
}
export declare class TransportInputType {
    name: string;
    percent: number;
}
export declare class ArticlePartnerStruct {
    id: string;
    name: string;
    brand: string;
    email: string;
    redirection_url: string;
    country: CriteriaObjectType[];
    material: CriteriaObjectType[];
    transport: TransportInputType[];
    image?: string;
    brandlogo: string;
    environnementdesc: string;
    ethicaldesc: string;
    branddesc: string;
    price: number;
    rgb: number[];
    ethical_score: number;
    ecological_score: number;
    local_score: number;
    type: string;
    lastbought: Date;
    lastshown: Date;
    lastclick: Date;
}
export declare class ArticlePartnerResponse {
    status: number;
    devMessage: string;
    userMessage: string;
}
export declare class ImageReturn {
    content: string;
}
export declare class ArticlePartnerListResponse {
    status: number;
    devMessage: string;
    userMessage?: string;
    articles: ArticlePartnerStruct[];
}
