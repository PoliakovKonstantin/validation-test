import { ArgumentMetadata, ArgumentsHost, Body, Catch, ExceptionFilter, Get, HttpStatus, Post, UseFilters, UsePipes } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { Controller,CallHandler, Injectable, NestInterceptor, ExecutionContext, HttpException,Req,PipeTransform,BadRequestException } from '@nestjs/common';
import {Request} from "express"
import { injectable } from 'inversify';
import { catchError, Observable,tap, throwError } from 'rxjs';
import { TestInterceptorService } from './test-interceptor.service';
import * as Joi from 'joi';
import { ObjectSchema } from'joi';

let a:any={}

@Catch()
export class ExceptionFilterTest implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const timestamp=new Date().toISOString()
        const http=host.switchToHttp()
        const res=http.getResponse()
        const statusCode=exception.getStatus()
        const errmsg=exception.message
        console.log(timestamp)
        res.status(statusCode).json({
            timestamp: timestamp,
            status:'fail',
            data:errmsg,
            code:statusCode||500
        })
    }

}

export const joi_test=Joi.object({
    number: Joi.any()
})

@Injectable()
export class Validation implements PipeTransform{
    constructor(private joi:ObjectSchema){}
    transform(value1: any, metadata: ArgumentMetadata) {
        const {error}=this.joi.validate(value1)
        if (error) {
            console.error(error)
            throw new BadRequestException('Validation failed');   
        } return value1;
        }
    }


@Injectable()
export class valueToOk implements PipeTransform{
    transform(value2: any, metadata: ArgumentMetadata) {
        value2='ok'
        if (value2==='ok') return value2
        else{
            throw new BadRequestException('Validation failed');
        }
    }
}
@Injectable()
export class TestInterceptor1 implements NestInterceptor {
    static a: any;
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            tap(()=>{
            a={
                    status:"success"
                }

            }),
            catchError((err)=>{
                console.log('fail!')
                const a:any={
                    status: "fail",
                    data: new HttpException('error',HttpStatus.BAD_GATEWAY)
                }
                return throwError(new HttpException('error',HttpStatus.BAD_GATEWAY))
            })
        )
    }

}

@Injectable()
@Controller('test-interceptor')
@UseFilters(ExceptionFilterTest)
@UseInterceptors(TestInterceptor1)
export class TestInterceptorController {
    @Get()
    getHi() {
        a.data="Hi!"
        return a
    }
     
    @Post()
    createSomething(@Req() request:Request, @Body(new Validation(joi_test),new valueToOk())body:any) {
        
        
        const number = request.body
        return number
    }
    
}
