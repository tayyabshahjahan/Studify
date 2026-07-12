pipeline {
    agent any
    tools{
        nodejs 'Nodejs 26.5'
    }
    environment{
         CREDS=credentials('GitHub')
    }
    parameters{
        choice(name:"VERSION",choices:['1.1.0','1.2.0','1.3.0'],description:"")
        choice(name:"SERVER",choices:['dev','test','prod'],description:"")
        booleanParam(name:"IS_TEST",defaultValue:false,description:"")
    }

    stages {
        stage('test'){
            when{
                expression{
                    params.IS_TEST
                }
            }
            steps{
                echo"running tests";
                sh'node --version'
            }
        }
        stage('Build'){
            steps{
                echo"built version ${params.VERSION}"
            }

        }
        stage('Deploy') {
            steps {
                echo "Deployed to ${params.SERVER}} "
            }
        }
    }
}
