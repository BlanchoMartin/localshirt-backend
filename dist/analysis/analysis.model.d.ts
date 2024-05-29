export declare class Message {
    msg?: string;
    email?: string;
    access_token?: string;
}
export declare class AuthResponse {
    status: number;
    content: Message;
}
export declare class User {
    id: number;
    email: string;
    password: string;
    name_company: string;
}
