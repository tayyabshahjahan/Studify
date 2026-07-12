pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'building the app'
                sh 'docker build -t studify-1.0.'
            }
        }

        stage('Push') {
            steps {
                echo "pushing the app"
                withcredentials([usernamePassword(
                    credentials:'docker-hub',usernameVariable:'USER',passwordVariable:"PWD"
                )])
                sh "echo ${PWD} | docker login -u  ${USER} --password-stdin" 
                sh 'docker push studify-1.0'
                echo "pushed img"
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy step'
            }
        }
    }
}
