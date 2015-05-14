@echo off
set /p mongoPath="Enter directory path of mongo(c:\Program Files\MongoDB): "
C:
cd "%mongoPath%\Server\3.0\bin"
echo 'Connecting mongodb......'
@echo off
set /p dataPath="Enter directory path for data storage(D:\My Data\MongoDB): "
START /MIN mongod --dbpath "%dataPath%"
echo 'Initializing DB......'
timeout 10
@echo off
set /p repoPath="Enter Path of checkedout repositry(D:\My Repo): "
echo 'Creating DB......'
timeout 10
mongo localhost:27017/knockout-node "%repoPath%\script.js"
pause