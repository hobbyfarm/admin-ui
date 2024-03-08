import YAML from 'yaml'
import { VMTemplateServiceConfiguration } from './vm-template-service-configuration';



export class CloudInitConfig {
    contentMap: Map<string, string[]> = new Map();
    cloudConfigYaml: string = ""
    public vmServices: Map<string, VMTemplateServiceConfiguration> = new Map()

    addContent(key: string, value: any) {
        if (this.contentMap.has(key)) {
            if(Array.isArray(value)) {
                value.forEach(element => this.contentMap.get(key).push(element))                
            }
            else this.contentMap.get(key).push(value)
        }
        else {
            this.contentMap.set(key, value)
        }
    }


    removeVMService(id: string) {
        this.vmServices.delete(id)
        this.buildNewYAMLFile()
    }

    addVMService(newInterface: VMTemplateServiceConfiguration) {
        this.vmServices.set(newInterface.id, newInterface)
        this.buildNewYAMLFile()
    }

    buildMapFromString(text: string) {
        if(!text) {
            return new Map()
        }
        let yaml = YAML.parse(text)
        return new Map(Object.entries(yaml))
    }

    getConfigAsString() {
        if (this.contentMap.size < 1) {
            return ''
        }
        return "#cloud-config\n"+YAML.stringify(this.contentMap)        
    }    

    buildNewYAMLFile() {   
        this.contentMap = new Map()
        this.vmServices.forEach((vmService: VMTemplateServiceConfiguration) => {
            vmService.cloudConfigMap.forEach((value, key) => {
                let valCopy = structuredClone(value)
                let keyCopy = structuredClone(key)
                this.addContent(keyCopy, valCopy) 
            })  
        })
        this.cloudConfigYaml = this.getConfigAsString()
        return this.cloudConfigYaml        
    }
}
