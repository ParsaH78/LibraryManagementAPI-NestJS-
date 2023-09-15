import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

/* eslint-disable prettier/prettier */
export class UserResponseDto {
  @IsString()
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^09[0|1|2|3][0-9]{8}$/, {
    message: 'Phone must be a valid phone number'
  })
  phone_number: string;

  @IsString()
  @Matches(/^09[0|1|2|3][0-9]{8}$/, {
    message: 'Phone must be a valid phone number'
  })
  address: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(20)
    username?: string;
  
    @IsOptional()
    @IsString()
    @Matches(/^09[0|1|2|3][0-9]{8}$/, {
      message: 'Phone must be a valid phone number'
    })
    phone_number?: string;
  
    @IsOptional()
    @IsString()
    address?: string;

}

export class SelectUserDto {
  @IsOptional()
  @IsBoolean()
  username?: boolean;

  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @IsOptional()
  @IsBoolean()
  phone_number?: boolean;

  @IsOptional()
  @IsBoolean()
  address?: boolean;
}
