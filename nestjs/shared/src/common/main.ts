async function boostrap() {
  await NestFactory.create(SharedModule);
}
boostrap();
