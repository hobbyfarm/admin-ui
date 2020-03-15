export class VirtualMachine {
    id: string = "";
    vm_template_id: string = "";
    keypair_name: string = "";
    vm_claim_id: string = "";
    user: string = "";
    status: string = "";
    allocated: boolean = false;
    tainted: boolean = false;
    public_ip: string = "";
    private_ip: string = "";
    environment_id: string = "";
    hostname: string = "";
    tfstate: string = "";
    ws_endpoint: string = "";
}