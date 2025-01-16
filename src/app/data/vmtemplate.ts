export class VMTemplate {
    id: string;
    name: string;
    image: string;
    config_map: Record<string, string>;
    cost_base_price?: string;
    cost_time_unit?: string;
}
