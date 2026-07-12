pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'building the app'
                sh 'docker build -t tayyabshahjehan/studify-1.0 .'
            }
        }

         stage('Push') {
                steps {
                echo "pushing the app"
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub',
                    usernameVariable: 'USER',
                    passwordVariable: 'PWD'
                )]) {
                    sh "echo ${PWD} | docker login -u ${USER} --password-stdin"
                    sh 'docker push tayyabshahjehan/studify-1.0'
                    echo "pushed img"
                }
        }
}

        stage('Deploy') {
            steps {
                echo 'Deploy step'
            }
        }
    }
}
