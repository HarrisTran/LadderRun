pipeline {
    agent any
    tools {nodejs "node"}
    stages{
        stage('Build') {
            steps{
                bat '/Applications/Cocos/Creator/2.4.6/CocosCreator.app --project . --build \"platform=web-desktop\"'
            }
        }
        stage('Archiving Artifacts') {
            steps {
                echo 'fuck'
            }
        }
    }
}