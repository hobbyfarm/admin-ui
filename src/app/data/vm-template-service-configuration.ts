import YAML from 'yaml';
export class VMTemplateServiceConfiguration {
  public name: string = '';
  public hasWebinterface = false;
  public port?: number = -1;
  public path?: string = '/';
  public hasOwnTab?: boolean = false;
  public noRewriteRootPath?: boolean = false;
  public rewriteHostHeader?: boolean = true;
  public rewriteOriginHeader?: boolean = false;
  public disallowIFrame?: boolean = false;
  public cloudConfigMap?: Map<string, Object> = new Map();
  public cloudConfigString?: string = '';
}

export function getCloudConfigString(
  vmService: VMTemplateServiceConfiguration
) {
  return YAML.stringify(vmService.cloudConfigMap);
}

export function vmServiceToJSON(vmService: VMTemplateServiceConfiguration) {
  let result =
    '{"name": "' +
    vmService.name +
    '" ,"hasWebinterface": ' +
    vmService.hasWebinterface;
  if (vmService.port) {
    result += ', "port": ' + vmService.port;
  }
  if (vmService.path) {
    result += ', "path": ' + JSON.stringify(vmService.path);
  }
  if (vmService.hasOwnTab) {
    result += ', "hasOwnTab": ' + vmService.hasOwnTab;
  }
  if (vmService.rewriteHostHeader) {
    result += ', "rewriteHostHeader": ' + vmService.rewriteHostHeader;
  }
  if (vmService.rewriteOriginHeader) {
    result += ', "rewriteOriginHeader": ' + vmService.rewriteOriginHeader;
  }
  if (vmService.disallowIFrame) {
    result += ', "disallowIFrame": ' + vmService.disallowIFrame;
  }
  if (vmService.noRewriteRootPath) {
    result += ', "noRewriteRootPath": ' + vmService.noRewriteRootPath;
  }
  if (vmService.cloudConfigMap) {
    let cloudConfigMapString = '';
    vmService.cloudConfigMap.forEach((value, key) => {
      cloudConfigMapString += '"' + key + '": ' + JSON.stringify(value) + ' ';
    });
    result += ', "cloudConfigMap": {' + cloudConfigMapString + '}';
  }
  result += '}';
  return result;
}
