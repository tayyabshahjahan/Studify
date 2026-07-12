pipeline {
    agent any

    environment{
         VERSION="1.20"
         SERVER="PROD"
    }

    stages {
        stage('Build') {
            when{
                expression{
                    env.SERVER=="PROD"
                }
            }
            steps {
                echo "built version ${VERSION} "
            }
        }
    }
}
