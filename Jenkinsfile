pipeline {
    agent{
        any
    }
    stages{
        stage('Checkout'){
            steps{
                echo 'Checkout'
            }
        }

        stage('Build') {
            steps{
                sh 'npm update'
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