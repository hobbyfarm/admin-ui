export class Environment {
  name: string;
  display_name: string;
  dnssuffix: string;
  provider: string;
  // e.g. "{ ubuntu1604-docker1: { "image": "ubuntu1604-docker1-base" } }"
  template_mapping: Record<string, Record<string, string>>;
  environment_specifics: Record<string, string>;
  ip_translation_map: { [key: string]: string };
  ws_endpoint: string;
  count_capacity: Record<string, number>;
}
