/// <reference types="node" />
export declare class Users {
    id: string;
    email: string;
    password: string;
    name: string;
    lastName: string;
    businessRole: string;
    businessContact: string;
    business_logo: Buffer;
    profil_picture: Buffer;
    businessName: string;
    businessDescription: string;
    businessAdress: string;
    businessZipCode: string;
    businessCity: string;
    businessCountry: string;
    businessLink: string;
    isConfirmed: boolean;
    isDeveloper: boolean;
    confirmationToken: string;
    resetPassword: boolean;
    resetPasswordReference: string;
}
