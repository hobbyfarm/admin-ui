import YAML from 'yaml';
export class VMTemplateServiceConfiguration {
  public name: string;
  public hasWebinterface;
  public port?: number;
  public path?: string;
  public hasOwnTab?: boolean;
  public noRewriteRootPath?: boolean;
  public rewriteHostHeader?: boolean;
  public rewriteOriginHeader?: boolean;
  public disallowIFrame?: boolean;
  public cloudConfigMap?: Map<string, Object>;
  public cloudConfigString?: string;

  constructor(
    name = '',
    hasWebinterface = false,
    port: number = -1,
    path: string = '/',
    hasOwnTab: boolean = false,
    noRewriteRootPath: boolean = false,
    rewriteHostHeader: boolean = true,
    rewriteOriginHeader: boolean = false,
    disallowIFrame: boolean = false,
    cloudConfigString: string = ''
  ) {
    this.name = name;
    this.hasWebinterface = hasWebinterface;
    this.port = port;
    this.path = path;
    this.hasOwnTab = hasOwnTab;
    this.noRewriteRootPath = noRewriteRootPath;
    this.rewriteHostHeader = rewriteHostHeader;
    this.rewriteOriginHeader = rewriteOriginHeader;
    this.disallowIFrame = disallowIFrame;
    this.cloudConfigString = cloudConfigString;
    this.cloudConfigMap = new Map();
    if (this.cloudConfigString.length > 0) {
      try {
        this.cloudConfigMap = YAML.parse(this.cloudConfigString);
      } catch (e) {
        this.cloudConfigString = `YAML-Parse-Error: |
  The following Error occured while parsing the Cloud Config of this Service:
  ${(e as Error).message}`;
        this.cloudConfigMap = new Map();
      }
    }
  }
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

  //only add webinterface settings if the service has a webinterface.
  if (vmService.hasWebinterface) {
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
