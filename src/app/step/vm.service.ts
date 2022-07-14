import { Injectable } from '@angular/core';
import { ResourceClient, GargantuaClientFactory } from '../data/gargantua.service';
import { VirtualMachine as VM } from '../data/virtualmachine';

@Injectable()
export class VMService extends ResourceClient<VM> {
  constructor(gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/vm'));
  }

  get(id: string) {
    // Do not use cached responses
    this.cache.clear();

    return super.get(id);
  }
}
