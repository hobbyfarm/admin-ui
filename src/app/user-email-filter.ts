import { ClrDatagridStringFilterInterface } from '@clr/angular';
import { User } from './data/user';

export class UserEmailFilter implements ClrDatagridStringFilterInterface<User>{
    accepts(item: User, search: string) {
        return item.email.search(search) == -1 ? false : true;
    }
}
