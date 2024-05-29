import { Resolver, Args, Context, Query, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Req, UseGuards } from '@nestjs/common';
import {AuthResponse, CompaniesListResponse, Company, User, UserAuthResponse, UserListResponse} from './auth.model';
import { AuthGuard } from './strategy/jwt-auth.guard';

/**
 * Auth Resolver
 * 
 * @category Resolvers
 * @class
 * @classdesc Resolver for auth queries
 */
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) { }

  
  @Query((returns) => UserListResponse)
  async getAllUsers(
    @Context() context,
  ) {
    return await this.authService.findAll();
  }

  /**
  * Login
  * 
  * @async
  * @returns {Promise<AuthResponse>} A token of connexion
  */
  @Query((returns) => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login({ email, password });
  }

  /**
  * Register
  * 
  * @async
  * @returns {Promise<AuthResponse>} A token of connexion
  */
  @Query((returns) => AuthResponse)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args('lastName') lastName: string,
    @Args('businessRole') businessRole: string,
    @Args('businessContact') businessContact: string,
    @Args('businessName') businessName: string,
    @Args('business_logo') business_logo: string,
    @Args('profil_picture') profil_picture: string,
    @Args('businessDescription') businessDescription: string,
    @Args('businessLink') businessLink: string,
    @Context() context,
  ) {
    return this.authService.createUser(
      {
        email,
        password,
        name,
        lastName,
        businessRole,
        businessContact,
        businessName,
        business_logo,
        profil_picture,
        businessDescription,
        businessLink
      },
      context.req,
    );
  }

  @Query((returns) => AuthResponse)
  async confirm(@Args('token') token: string) {
    return this.authService.confirmRegistration(token);
  }

  @Query((returns) => AuthResponse)
  async send_email_password(@Args('email') email: string, @Context() context) {
    return this.authService.send_email_password({ email }, context.req);
  }

  @Query((returns) => AuthResponse)
  async forget_password(
    @Args('resetPasswordReference') resetPasswordReference: string,
    @Args('password') password: string,
    @Args('confirm_password') confirm_password: string,
    @Context() context,
  ) {
    return this.authService.change_password({
      resetPasswordReference,
      password,
      confirm_password
    });
  }

  @UseGuards(AuthGuard)
  @Query((returns) => UserAuthResponse)
  async profile(@Context() context) {
    return this.authService.getUser(context.req.user);
  }

  @Query((returns) => AuthResponse)
  async delete_connected_user(@Context() context) {
    return this.authService.deleteUserConnected(context.req);
  }

  @Query((returns) => AuthResponse)
  async user_ask_dev_perm(@Context() context) {
    return this.authService.userAskDev(context.req);
  }

  @Query((returns) => AuthResponse)
  async confirmDev(@Args('token') token: string) {
    return this.authService.giveDevPermission(token);
  }

  @Query((returns) => AuthResponse)
  async delete_user_by_id(@Args('id') id: string, @Context() context) {
    return this.authService.deleteByDeveloper(id, context.req);
  }

  @Query((returns) => AuthResponse)
  async update_connected_user(
    @Args('name', { defaultValue: 'null' }) name: string,
    @Args('lastName', { defaultValue: 'null' }) lastName: string,
    @Args('businessRole', { defaultValue: 'null' }) businessRole: string,
    @Args('businessContact', { defaultValue: 'null' }) businessContact: string,
    @Args('businessName', { defaultValue: 'null' }) businessName: string,
    @Args('businessAdress', { defaultValue: 'null' }) businessAdress: string,
    @Args('businessZipCode', { defaultValue: 'null' }) businessZipCode: string,
    @Args('businessCity', { defaultValue: 'null' }) businessCity: string,
    @Args('businessCountry', { defaultValue: 'null' }) businessCountry: string,
    @Args('isConfirmed', { defaultValue: false }) isConfirmed: boolean,
    @Args('isDeveloper', { defaultValue: false }) isDeveloper: boolean,
    @Args('businessDescription', { defaultValue: 'null' }) businessDescription: string,
    @Args('business_logo', { defaultValue: 'null' }) business_logo: string,
    @Args('profil_picture', { defaultValue: 'null' }) profil_picture: string,
    @Context() context,
  ) {
    return this.authService.updateConnectedUser({
      name,
      lastName,
      businessRole,
      businessContact,
      businessName,
      businessAdress,
      businessZipCode,
      businessCity,
      businessCountry,
      businessDescription,
      business_logo,
      profil_picture,
    }, context.req);
  }

  @Mutation((returns) => AuthResponse)
  async updated_admin_user(
    @Args('id', { defaultValue: "null" }) id: string,
    @Args('email', { defaultValue: 'null' }) email: string,
    @Args('name', { defaultValue: 'null' }) name: string,
    @Args('lastName', { defaultValue: 'null' }) lastName: string,
    @Args('businessRole', { defaultValue: 'null' }) businessRole: string,
    @Args('businessName', { defaultValue: 'null' }) businessName: string,
    @Args('isConfirmed', { defaultValue: false }) isConfirmed: boolean,
    @Args('isDeveloper', { defaultValue: false }) isDeveloper: boolean,
    
    @Context() context,
  ) {
    return this.authService.UpdateUserByAdmin({
      name,
      email,
      lastName,
      businessRole,
      businessName,
      isConfirmed,
      isDeveloper,
     }, context.req);
  }


  @Query((returns) => AuthResponse)
  async update_email_user_by_id(
    @Args('id') id: string,
    @Args('email') email: string,
    @Context() context,
  ) {
    return this.authService.updateEmailById(
      context.req,
      id,
      email);
  }

  @Query((returns: void) => CompaniesListResponse)
  async get_companies(): Promise<CompaniesListResponse> {
    return await this.authService.getCompanies();
  }
}
