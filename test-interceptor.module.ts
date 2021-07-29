import { Module } from '@nestjs/common';
import { /*TestInterceptor,*/ TestInterceptorController } from './test-interceptor.controller';
import { TestInterceptorService } from './test-interceptor.service';

@Module({
  imports: [],
  controllers: [TestInterceptorController/*,TestInterceptor*/],
  providers: [TestInterceptorService]//,
  //providers: [TestInterceptor]//,
  //providers: [TestInterceptor]
})
export class TestInterceptorModule {}



