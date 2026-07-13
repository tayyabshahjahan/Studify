@Library('Jenkins-Shared-Library@master') _
pipeline {
    agent any
    parameters {
    choice(name: 'VERSION_TYPE', choices: ['patch', 'minor', 'major'], description: 'Version bump type')
            }

    stages {
        stage('Increment Version') {
    steps {
        script {
            def newVersion = incrementVersion(params.VERSION_TYPE)
            env.IMAGE_TAG = "tayyabshahjehan/studify:${newVersion}"
        }
    }
}
        stage('Test') {
            steps {
                echo "testinging: ${IMAGE_TAG}"
            }
        }
        stage('Build') {
            when {
                expression {
                    env.BRANCH_NAME == "main"
                }
            }
            steps {
                build("${env.IMAGE_TAG}")
            }
        }
        stage('Push') {
            when {
                expression {
                    env.BRANCH_NAME == "main"
                }
            }
            steps {
                push("${IMAGE_TAG}", 'docker-hub')
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy step'
            }
        }
    }
}