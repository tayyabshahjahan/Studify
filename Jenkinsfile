pipeline {
    agent any

    environment{
         VERSION="1.20"
         SERVER="PROD"
         CREDS=credentials('GitHub')
    }

    stages {
        stage('Build'){
            steps{
                sh"....${CREDS}..."
            }

        }
        stage('Deploy') {
            when{
                expession{
                    env.SERVER=="PROD"
                }
            }
            steps {
                echo "Deployed version {$VERSION} "
            }
        }
    }
}
