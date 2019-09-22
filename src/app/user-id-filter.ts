import { User } from './data/user';

export class UserIdFilter {
    accepts(item: User, search: string) {
        return item.id.search(search) == -1 ? false : true;
    }
}
