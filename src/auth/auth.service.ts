import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param {UsersService} usersService - The service for managing users.
   * @param {JwtService} jwtService - The service for generating and validating JWT.
   */
  constructor(
    private readonly usersService: UsersService, // Inject UsersService
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}
  /**
   * Validates a user by their username and password.
   *
   * @param {string} username - The username of the user to validate.
   * @param {string} pass - The password of the user to validate.
   * @returns {Promise<any>} - A promise that resolves to the user object (excluding password) if the user is valid,
   *                            or null if the user is not valid.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  /**
   * Logs in a user and returns a JSON Web Token (JWT) with their username and user ID.
   *
   * @param {any} user - The user object containing the username and user ID.
   * @returns {Promise<{access_token: string}>} - A promise that resolves to an object containing
   *                                               the JWT.
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async encryptData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  async decryptData(hash: string, data: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
