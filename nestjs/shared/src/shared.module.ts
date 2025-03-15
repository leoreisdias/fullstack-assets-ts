@Module({})
export class SharedModule {
  static register(): DynamicModule {
    return {
      module: SharedModule,
      imports: [
        PrismaModule,
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "30d" },
        }),
        DeadLetterModule,
        // outros que sejam compartilhados
      ],
      providers: [
        {
          provide: "APP_FILTER",
          useClass: AllExceptionsFilter,
        },
      ],
      exports: [],
    };
  }
}
