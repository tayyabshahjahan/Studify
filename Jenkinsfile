pipeline {
    agent any

    environment{
         VERSION="1.20"
         SERVER="PROD"
    }

    stages {
        stage('Build') {
            when{
                expession{
                    env.SERVER=="PROD"
                }
            }
            steps {
                echo "built version {$VERSION} "
            }
        }
    }
}
