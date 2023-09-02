import { User } from 'src/database/entity/user.entity';

export interface UserReq extends Request {
  user: User;
}
