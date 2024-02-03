import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryPaginationDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  public page = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  public take = 10;

  @IsOptional()
  public get skip(): number {
    return (this.page - 1) * this.take;
  }
}
l