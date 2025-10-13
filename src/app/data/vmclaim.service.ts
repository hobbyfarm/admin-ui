import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceClient, GargantuaClientFactory } from './gargantua.service';
import { VMClaim } from './vmclaim';
import { VMClaimVM } from './vmclaimvm';

type VMClaimServer = Omit<VMClaim, 'vm'> & { vm: Record<string, VMClaimVM> };

@Injectable()
export class VMClaimService extends ResourceClient<VMClaimServer> {
  constructor(gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/vmclaim'));
  }

  // Do not use cached responses
  getVMClaim(id: string, force = false): Observable<VMClaim> {
    this.cache.clear();

    return super.get(id, force).pipe(
      map((v: VMClaimServer) => {
        const vm = new Map<string, VMClaimVM>(
          Object.keys(v.vm).map((k) => [k.toLowerCase(), v.vm[k]]),
        );
        return { ...(v as unknown as Omit<VMClaim, 'vm'>), vm };
      }),
    );
  }
}
