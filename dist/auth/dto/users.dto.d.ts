/// <reference types="node" />
export declare class LoginDTO {
    email: string;
    password: string;
}
export declare class UsersDTO {
    email: string;
    password: string;
    name: string;
    lastName: string;
    businessRole: string;
    businessContact: string;
    business_logo: Buffer;
    profil_picture: Buffer;
    businessName: string;
    confirmationToken: string;
    isDevelopper: boolean;
    businessDescription: string;
    businessLink: string;
}
