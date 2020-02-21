@Library('boxboat-dockhand@master')
import com.boxboat.jenkins.pipeline.build.*

properties([
  buildDiscarder(logRotator(numToKeepStr: '100'))
])

def build = new BoxBuild()

node() {
  build.wrap {
    gitlabCommitStatus {
      stage('Test'){
        build.composeBuild("sdk")
      }
      stage('Build'){
        build.composeBuild("release")
      }
      stage ('Push'){
        build.push()
      }
    }
  }
}
