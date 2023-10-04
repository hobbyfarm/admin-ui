import { ClrDatagridStringFilterInterface } from '@clr/angular';
import { User } from './data/user';

export class UserAccesscodeFilter implements ClrDatagridStringFilterInterface<User>{
    accepts(item: User, search: string) {
        let resultingUserList = item.access_codes.some(ac => {
            return ac.toLowerCase().search(search.toLowerCase()) != -1               
        })
        return resultingUserList
    }
}