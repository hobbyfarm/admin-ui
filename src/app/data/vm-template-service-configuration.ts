
export class VMTemplateServiceConfiguration {
    public name: string = ""
    public hasWebinterface = false
    public port?: number = -1
    public hasOwnTab?: boolean = false
    public cloudConfigMap?: Map<string, Object> = new Map()
    public cloudConfigString?: string = ''    
}

