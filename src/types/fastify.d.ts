import { UserRole } from "../../generated/prisma/enums";



declare module "fastify" {
    interface FastifyRequest {
        user?: {
            userId: string;
            email: string;
            role: UserRole;
        }
    }
}