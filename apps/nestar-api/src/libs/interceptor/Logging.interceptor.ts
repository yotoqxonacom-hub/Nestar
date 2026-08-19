import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const recordTime = Date.now();
        const requestType = context.getType<GqlContextType>();

        if (requestType === 'http') {
            // Develop if needed!
        } else if (requestType === 'graphql') {
            /* (1) Request printing... */
            const gqlContext = GqlExecutionContext.create(context);
            this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, 'REQUEST');
        }
        /* (2) error handling with GraphQL*/


        /* (3) No errors, giving respons below */
        return next.handle().pipe(
            tap((context) => {
                const responseTime = Date.now() - recordTime;
                this.logger.log(`${this.stringify(context)} ~ ${responseTime}ms \n\n`, 'RESPONSE');
            }),
        );
    }

    private stringify(context: ExecutionContext): string {
        return JSON.stringify(context).slice(0, 75);
    }


}

