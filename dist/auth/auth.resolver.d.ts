import { AuthService } from './auth.service';
import { AuthResponse, CompaniesListResponse, UserAuthResponse, UserListResponse } from './auth.model';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    getAllUsers(context: any): Promise<UserListResponse>;
    login(email: string, password: string): Promise<AuthResponse>;
    register(email: string, password: string, name: string, lastName: string, businessRole: string, businessContact: string, businessName: string, business_logo: string, profil_picture: string, businessDescription: string, businessLink: string, context: any): Promise<AuthResponse>;
    confirm(token: string): Promise<AuthResponse>;
    send_email_password(email: string, context: any): Promise<Record<string, any>>;
    forget_password(resetPasswordReference: string, password: string, confirm_password: string, context: any): Promise<{
        status: import("@nestjs/common").HttpStatus;
        content: {
            msg: string;
        };
        devMessage: string;
    }>;
    profile(context: any): Promise<UserAuthResponse>;
    delete_connected_user(context: any): Promise<AuthResponse>;
    user_ask_dev_perm(context: any): Promise<AuthResponse>;
    confirmDev(token: string): Promise<AuthResponse>;
    delete_user_by_id(id: string, context: any): Promise<AuthResponse>;
    update_connected_user(name: string, lastName: string, businessRole: string, businessContact: string, businessName: string, businessAdress: string, businessZipCode: string, businessCity: string, businessCountry: string, isConfirmed: boolean, isDeveloper: boolean, businessDescription: string, business_logo: string, profil_picture: string, context: any): Promise<Record<string, any>>;
    updated_admin_user(id: string, email: string, name: string, lastName: string, businessRole: string, businessName: string, isConfirmed: boolean, isDeveloper: boolean, context: any): Promise<Record<string, any>>;
    update_email_user_by_id(id: string, email: string, context: any): Promise<AuthResponse>;
    get_companies(): Promise<CompaniesListResponse>;
}
