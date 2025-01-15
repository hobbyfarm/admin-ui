export class Cost {
  cost_group: string;
  total: number;
  source: Array<CostSource>;
}

export class CostSource {
  kind: string;
  cost: number;
  count: number;
}

export class DetailedCost {
    cost_group: string
    source: Array<DetailedCostSource>
}

export class DetailedCostSource {
    kind: string;
    base_price: number;
    time_unit: string;
    id: string;
    creation_unix_timestamp: number;
    deletion_unix_timestamp?: number;
}