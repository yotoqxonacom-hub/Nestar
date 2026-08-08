import { Query, Resolver } from "@nestjs/graphql";
import { AppService } from "./app.service";

@Resolver()
export class AppResolver {
    @Query(() => String)
    public sayHello(): string {
        return ' DraphQl API server is running successfully';
    }
}