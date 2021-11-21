import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'src/utils/constant';

export class UpdateStatusOrderDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  readonly status: string;
}
