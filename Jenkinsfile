@Library('Jenkins-Shared-Library@master') _
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                build('tayyabshahjehan/test')
            }
        }
        stage('Push') {
            steps {
                push('tayyabshahjehan/test', 'docker-hub')
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy step'
            }
        }
    }
}
