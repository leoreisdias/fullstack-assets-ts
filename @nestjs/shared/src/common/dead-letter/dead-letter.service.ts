import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';

@Injectable()
export class DeadLetterService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: {
    body: any;
    headers: any;
    method: string;
    url: string;
    error: any;
    params: any;
    query: any;
    user: any;
    status: number;
  }) {
    return this.prismaService.deadLetter.create({
      data,
    });
  }
}
