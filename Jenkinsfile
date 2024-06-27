pipeline {
    agent{
        any
    }
    stages{
        stage('Checkout'){
            steps{
                git 'https://github.com/HarrisTran/LadderRun.git'
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