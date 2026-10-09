import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'กรุณากรอกอีเมล' })
  email: string;

  @IsString({ message: 'รหัสผ่านต้องเป็นข้อความ' })
  @MinLength(6, { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  password: string;

  @IsString({ message: 'ชื่อ-นามสกุลต้องเป็นข้อความ' })
  @IsNotEmpty({ message: 'กรุณากรอกชื่อ-นามสกุล' })
  fullName: string;
}
