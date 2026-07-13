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
            withCredentials([usernamePassword(
                credentialsId: 'GitHub',
                usernameVariable: 'USER',
                passwordVariable: 'PASS'
            )]) {
                sh 'git config --global user.email "jenkins@example.com"'
                sh 'git config --global user.name "Jenkins"'

                sh "git remote set-url origin https://${USER}:${PASS}@github.com/tayyabshahjahan/Studify.git"
                sh 'git add package.json'
                sh 'git commit -m "bump version"'
                sh "git push origin ${env.BRANCH_NAME}"
            }
        }
    }
}
        stage('Test') {
            steps {
                echo "testing: ${env.IMAGE_TAG}"
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
                push("${env.IMAGE_TAG}", 'docker-hub')
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy step'
            }
        }
    }
}
