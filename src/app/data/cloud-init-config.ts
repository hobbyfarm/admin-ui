import YAML from 'yaml';
import { VMTemplateServiceConfiguration } from './vm-template-service-configuration';

export class CloudInitConfig {
  contentMap: Map<string, string[]> = new Map();
  cloudConfigYaml: string = '';
  public vmServices: Map<string, VMTemplateServiceConfiguration> = new Map();

  addContent(key: string, value: any) {
    const content = this.contentMap.get(key);
    if (!content) {
      this.contentMap.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((element) => content.push(element));
    } else {
      content.push(value);
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

  buildMapFromString(text: string): Record<string, any> {
    if (!text) {
      return {};
    }
    return YAML.parse(text);
  }

  getConfigAsString() {
    if (this.contentMap.size < 1) {
      return '';
    }
    return '#cloud-config\n' + YAML.stringify(this.contentMap);
  }

  buildNewYAMLFile() {
    this.contentMap = new Map();
    for (const [_, vmService] of this.vmServices) {
      if (!vmService.cloudConfigMap) {
        continue;
      }
      for (const [key, value] of Object.entries(vmService.cloudConfigMap)) {
        let valCopy = structuredClone(value);
        let keyCopy = structuredClone(key);
        this.addContent(keyCopy, valCopy);
      }
    }
    this.cloudConfigYaml = this.getConfigAsString();
    return this.cloudConfigYaml;
  }
}
