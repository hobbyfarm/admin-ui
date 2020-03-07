@Library('boxboat-dockhand@master')
import com.boxboat.jenkins.pipeline.build.*

properties([
  buildDiscarder(logRotator(numToKeepStr: '100'))
])

def build = new BoxBuild()

node() {
  build.wrap {
    stage('Test'){
      build.composeBuild("sdk")
      // Once tests written, enable this
      // sh '''
      //   docker run --rm -i hobbyfarm/admin-ui:${GIT_COMMIT_SHORT_HASH:-dev} npm test
      // '''
    }
    stage('Build'){
      build.composeBuild("release")
    }
    stage ('Push'){
      build.push()
    }
  }
}
