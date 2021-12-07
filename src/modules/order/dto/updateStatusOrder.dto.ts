import { IsEnum, IsNotEmpty } from 'class-validator';

enum OrderStatus {
  PROCESSING = 'PROCESSING',
  SUCCESSFUL = 'SUCCESSFUL',
  REJECT = 'REJECT',
}

export class UpdateStatusOrderDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  readonly status: string;
}
