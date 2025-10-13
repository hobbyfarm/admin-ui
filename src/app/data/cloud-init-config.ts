import YAML from 'yaml';
import { VMTemplateServiceConfiguration } from './vm-template-service-configuration';

export class CloudInitConfig {
  contentMap: Map<string, string[]> = new Map();
  cloudConfigYaml: string = '';
  public vmServices: Map<string, VMTemplateServiceConfiguration> = new Map();

  addContent(key: string, value: unknown): void {
    const toStrings = (v: unknown): string[] =>
      Array.isArray(v) ? v.map((e) => String(e ?? '')) : [String(v ?? '')];

    const incoming = toStrings(value);
    const existing = this.contentMap.get(key);

    if (!existing) {
      this.contentMap.set(key, incoming);
    } else {
      existing.push(...incoming);
    }
  }

  removeVMService(id: string) {
    this.vmServices.delete(id);
    this.buildNewYAMLFile();
  }

  addVMService(newInterface: VMTemplateServiceConfiguration) {
    this.vmServices.set(newInterface.id, newInterface);
    this.buildNewYAMLFile();
  }

  buildMapFromString(text: string): Record<string, unknown> {
    if (!text) {
      return {};
    }
    const parsed = YAML.parse(text) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  }

  getConfigAsString() {
    if (this.contentMap.size < 1) {
      return '';
    }
    return '#cloud-config\n' + YAML.stringify(this.contentMap);
  }

  buildNewYAMLFile() {
    this.contentMap = new Map();
    for (const [, vmService] of this.vmServices) {
      if (!vmService.cloudConfigMap) {
        continue;
      }
      for (const [key, value] of Object.entries(vmService.cloudConfigMap)) {
        const valCopy = structuredClone(value);
        const keyCopy = structuredClone(key);
        this.addContent(keyCopy, valCopy);
      }
    }
    this.cloudConfigYaml = this.getConfigAsString();
    return this.cloudConfigYaml;
  }
}
