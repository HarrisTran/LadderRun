pipeline {
    agent{
        any
    }
    stages{
        stage('Checkout'){
            steps{
                checkout scm
                sh 'npm update'
            }
        }

        stage('Build') {
            steps{
                echo 'Building...'
            }
        }

        stage('Deploy') {
            steps{
                echo 'Deploying...'
            }
        }
    }
}