import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './dtos';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(data: SignUpDto) {
    const userExists = await this.userService.findOneByEmail(data.email);

    if (userExists) {
      throw new ConflictException('User already exists !');
    }

    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(data.password, salt);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: hashedPassword,
          phone_number: data.phone_number,
          address: data.address,
          user_type: UserType.ADMIN,
        },
      });

      const payload = { id: user.id, username: user.username };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(
        `Error in signing up : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new HttpException('There is no user with this email', 400);
    }

    const hashedPassword = user.password;

    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    const payload = { id: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

    return bcrypt.hash(string, 10);
  }
}
