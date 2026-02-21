import { UserRole } from "../../../generated/prisma/enums";
import { JWTPayload } from "./../../../node_modules/jose/dist/types/types.d";

export interface JwtPayload extends JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}
