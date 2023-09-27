import { Repository } from "typeorm";
import { TokenEntity } from "../entities/token.entity";
import { myDataSource } from "../config/datasource.config";
import jwt from "jsonwebtoken";
import { UserEntity } from "../entities/user.entity";

class TokenService {
  tokenRepository: Repository<TokenEntity>;
  constructor() {
    this.tokenRepository = myDataSource.getRepository(TokenEntity);
  }

  async getToken(token: string) {
    return await this.tokenRepository.findOne({
      where: { refresh_token: token },
    });
  }

  async removeToken(token: string) {
    const tokenFromDb = await this.getToken(token);
    if (tokenFromDb) await this.tokenRepository.delete({ id: tokenFromDb.id });
    return 1;
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(
        token,
        String(process.env.JWT_ACCESS_SECRET_KEY) || "jwt-access-secret"
      );
    } catch (error) {
      console.log(error);
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(
        token,
        String(process.env.JWT_REFRESH_SECRET_KEY) || "jwt-refresh-secret"
      );
    } catch (error) {
      console.log(error);
    }
  }

  generateAccessToken(user: UserEntity): string {
    const accessToken = jwt.sign(
      { id: user.id },
      String(process.env.JWT_ACCESS_SECRET_KEY) || "jwt-access-secret",
      {
        expiresIn:
          process.env.API_SERVICE_JWT_ACCESS_EXPIRATION || 10 * 60 * 1000,
      }
    );
    return accessToken;
  }
  generateRefreshToken(user: UserEntity): string {
    const refreshToken = jwt.sign(
      { id: user.id },
      String(process.env.JWT_REFRESH_SECRET_KEY) || "jwt-refresh-secret",
      {
        expiresIn:
          process.env.API_SERVICE_JWT_REFRESH_EXPIRATION ||
          1000 * 60 * 60 * 24 * 30,
      }
    );
    return refreshToken;
  }

  async saveRefreshToken(
    user: UserEntity,
    refreshToken: string
  ): Promise<TokenEntity> {
    const tokenData = await this.tokenRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    if (tokenData) {
      tokenData.refresh_token = this.generateRefreshToken(user);
      return await this.tokenRepository.save(tokenData);
    }
    const token = this.tokenRepository.create({
      user,
      refresh_token: refreshToken,
    });
    return await this.tokenRepository.save(token);
  }
}
export const tokenService = new TokenService();
