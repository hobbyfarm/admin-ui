import YAML from 'yaml'
import { Webinterface } from './webinterface';



export class CloudInitConfig {
    contentMap: Map<string, string[]> = new Map();
    cloudConfigYaml: string = ""
    public webinterfaces: Map<string, Webinterface> = new Map()

    getWebinterfacesWithoutConfigMap() {        
        let result= new Map()
        this.webinterfaces.forEach((v, k) => {
            result.set(k,{'name':v.name, 'port': v.port, 'hasOwnTab':v.hasOwnTab, 'cloudConfigString': v.cloudConfigString})
        })
        console.log(result)
        return result
    }

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

    //TODO: Remove
    buildConfigFromText(text: string) {
        if(!text) {
            text = ''
        }
        console.log("Stringify equals raw: ", YAML.stringify(text), text)
        // text = YAML.stringify(text)
        let yaml = YAML.parse(text)
        console.log("YAML Object type: ", yaml)
        // this.contentMap = yaml
        this.contentMap = new Map(Object.entries(yaml))
    }

    buildMapFromString(text) {
        if(!text) {
            return new Map()
        }
        let yaml = YAML.parse(text)
        return new Map(Object.entries(yaml))
    }

    getConfigAsString() {
        return "#cloud-config\n"+YAML.stringify(this.contentMap)        
    }

    addWebinterface(newInterface: Webinterface) {
        this.webinterfaces.set(newInterface.name, newInterface)
        this.buildNewYAMLFile()
    }

    buildNewYAMLFile() {   
        this.contentMap = new Map()
        this.webinterfaces.forEach((webinterface: Webinterface) => {
            webinterface.cloudConfigMap.forEach((value, key) => {
                this.addContent(key, value) 
            })            
        })
        this.cloudConfigYaml = this.getConfigAsString()
        return this.cloudConfigYaml
    }
}
