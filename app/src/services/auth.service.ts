import { myDataSource } from "../config/datasource.config";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { compare } from "bcrypt";
import { tokenService } from "./token.service";
import { AUTH_ERROR_MESSAGES } from "./constants/auth-error-messages.constant";
import { AccessTokenPayload } from "../interfaces/access-token-payload.interface";
import { ApiError } from "../common/api-error";

export class AuthService {
  userRepository: Repository<UserEntity>;
  constructor() {
    this.userRepository = myDataSource.getRepository(UserEntity);
  }

  async info(user: AccessTokenPayload): Promise<UserEntity> {
    const userFromDb = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!userFromDb) throw ApiError.NotFoundError("User not found.");
    return userFromDb;
  }

  async logout(refreshToken: string) {
    return await tokenService.removeToken(refreshToken);
  }

  async signup(user_id: string, password: string) {
    const candidate = await this.userRepository.findOne({ where: { user_id } });
    if (candidate) {
      throw ApiError.BadRequest("Email or phone number already used.");
    }
    const user = this.userRepository.create({ user_id, password });
    const savedUser = await this.userRepository.save(user);
    const tokens = {
      accessToken: tokenService.generateAccessToken(savedUser),
      refreshToken: tokenService.generateRefreshToken(savedUser),
    };
    await tokenService.saveRefreshToken(savedUser, tokens.refreshToken);
    return {
      tokens,
      savedUser,
    };
  }

  async signin(user_id: string, password: string) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw ApiError.BadRequest(AUTH_ERROR_MESSAGES["Invalid credentials"]);
    }
    const comparedPassword = await compare(password, user.password);
    if (!comparedPassword) {
      throw ApiError.BadRequest(AUTH_ERROR_MESSAGES["Invalid credentials"]);
    }
    const tokens = {
      accessToken: tokenService.generateAccessToken(user),
      refreshToken: tokenService.generateRefreshToken(user),
    };
    await tokenService.saveRefreshToken(user, tokens.refreshToken);
    return { tokens, user };
  }

  async refresh(refreshToken: string): Promise<string> {
    const validatedToken = tokenService.verifyRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.getToken(refreshToken);
    if (!validatedToken || !tokenFromDb) throw ApiError.UnauthorizedError();
    const user = await this.userRepository.findOne({
      //@ts-ignore
      where: { id: validatedToken.id },
    });
    if (user) {
      const accessToken = tokenService.generateAccessToken(user);
      return accessToken;
    } else {
      throw ApiError.UnauthorizedError();
    }
  }
}

export const authService = new AuthService();
