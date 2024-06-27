pipeline {
    agent any
    tools {nodejs "node"}
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