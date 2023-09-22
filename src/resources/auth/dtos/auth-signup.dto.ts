import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20, { message: 'Username should have maximum length of 20' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must have at least one Capital letter, one Small letter and one special character',
  })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^09[0|1|2|3][0-9]{8}$/, {
    message: 'Phone must be a valid phone number',
  })
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
