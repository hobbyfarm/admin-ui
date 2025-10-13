import YAML from 'yaml';
import * as uuid from 'uuid';
import { Protocol } from './protocol';
export class VMTemplateServiceConfiguration {
  public id: string;
  public name: string;
  public hasWebinterface: boolean;
  public port?: number;
  public path?: string;
  public protocol?: Protocol;
  public hasOwnTab?: boolean;
  public noRewriteRootPath?: boolean;
  public rewriteHostHeader?: boolean;
  public rewriteOriginHeader?: boolean;
  public disallowIFrame?: boolean;
  public disableAuthorizationHeader?: boolean;
  public cloudConfigMap?: Record<string, unknown>;
  public cloudConfigString?: string;

  constructor(
    name = '',
    hasWebinterface = false,
    port: number = -1,
    path: string = '/',
    protocol: Protocol = 'http',
    hasOwnTab: boolean = false,
    noRewriteRootPath: boolean = false,
    rewriteHostHeader: boolean = true,
    rewriteOriginHeader: boolean = false,
    disallowIFrame: boolean = false,
    disableAuthorizationHeader: boolean = false,
    cloudConfigString: string = '',
  ) {
    this.id = uuid.v4();
    this.name = name;
    this.hasWebinterface = hasWebinterface;
    this.port = port;
    this.path = path;
    this.protocol = protocol;
    this.hasOwnTab = hasOwnTab;
    this.noRewriteRootPath = noRewriteRootPath;
    this.rewriteHostHeader = rewriteHostHeader;
    this.rewriteOriginHeader = rewriteOriginHeader;
    this.disallowIFrame = disallowIFrame;
    this.disableAuthorizationHeader = disableAuthorizationHeader;
    this.cloudConfigString = cloudConfigString;
    this.cloudConfigMap = {};
    if (this.cloudConfigString.length > 0) {
      try {
        this.cloudConfigMap = YAML.parse(this.cloudConfigString);
      } catch (e) {
        this.cloudConfigString = `YAML-Parse-Error: |
  The following Error occured while parsing the Cloud Config of this Service:
  ${(e as Error).message}`;
        this.cloudConfigMap = {};
      }
    }
  }
}

export function getCloudConfigString(
  vmService: VMTemplateServiceConfiguration,
) {
  return YAML.stringify(vmService.cloudConfigMap);
}
