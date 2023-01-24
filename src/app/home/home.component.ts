import { Component, OnInit } from '@angular/core';
import { CloudInitConfig } from '../data/cloud-init-config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  public config: string;
  public description: string = 
`#cloud-config
runcmd:
    - export HOME=/root
    - curl -fsSL https://code-server.dev/install.sh > codeServerInstall.sh
    - /bin/sh codeServerInstall.sh && systemctl enable --now code-server@root
    - |
      sleep 5 && sed -i.bak 's/auth: password/auth: none/' ~/.config/code-server/config.yaml
    - sudo systemctl restart code-server@root
`
  private conf: CloudInitConfig;
  public confMap: Map<string, Object>

  ngOnInit() {    
    this.conf = new CloudInitConfig();
  }

  test() {
    this.conf.buildConfigFromText(this.description)
    this.config = this.conf.getConfigAsString()
    this.description = this.conf.getConfigAsString()
    this.confMap = this.conf.contentMap
    this.confMap.set("another command", "run more stuff")
    var obj = this.mapToObj(this.confMap);
    var jsonString = JSON.stringify(obj);
    console.log(this.conf.getConfigAsString())
  }

  mapToObj(map){
    const obj = {}
    for (let [k,v] of map)
      obj[k] = v
    return obj
  }


}
