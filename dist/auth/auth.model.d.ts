export declare class Message {
    email?: string;
    access_token?: string;
}
export declare class AuthResponse {
    status: number;
    devMessage: string;
    userMessage?: string;
    content?: Message;
}
export declare class Company {
    name: string;
    logo: string;
    description: string;
    businessLink: string;
}
export declare class CompaniesListResponse {
    status: number;
    content: string;
    companies: Company[];
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    lastName: string;
    businessRole: string;
    businessContact: string;
    businessName: string;
    businessAdress: string;
    businessZipCode: string;
    businessCity: string;
    businessCountry: string;
    businessDescription: string;
    isConfirmed: boolean;
    isDeveloper: boolean;
    business_logo: string;
    profil_picture: string;
}
export declare class UserAuthResponse {
    status: number;
    devMessage: string;
    userMessage?: string;
    user?: User;
}
export declare class UserListResponse {
    status: number;
    users: User[];
}
