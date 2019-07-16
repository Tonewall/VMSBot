# VMS Bot

Video Management System Bot is an automated bot used to diagnose and troubleshoot malfunctioning security cameras 
for the Georgia Tech Police Department.  

More information can be found at the bottom in the 'Background Information' section.

## Prerequisites
None


## Installing  
Do an `npm install` command in both the root directory (../VMSBot) and inside the client (../VMSBot/client) directory

## Create a Cameras File
For security reasons, the camera list is not included in the repository.
If you want to run the application with a list of cameras, create a "cameras.json" file in the root directory and create an object for each cameras with these fields:

    "deviceName": [NICKNAME FOR THE CAMERA],\
    "ip": [IP ADDRESS],\
    "serialNumber": [SERIAL NUMBER],\
    "macAddress": [MACADDRESS],\
    "modelNumber": [MODELNUMBER],\
    "userName": [USERNAME WHEN LOGGING IN],\
    "password": [PASSWORD WHEN LOGGING IN],\
    "headNum": [NUMBER OF HEADS THE CAMERA HAS],\
    "type": [TYPE OF CAMERA]\
  
For the type of camera, the application currently supports Avigilon ("A"), Pelco ("P"), and Panasonic Cameras ("PA"). If you want to test different brand cameras, edit the getCameraImage.js file to fit your need.


(Example of cameras.json file):\
[\
    {\
        "deviceName": "Avigilon Camera #1",\
        "ip": "172.23.4.24",\
        "serialNumber": "111704222197",\
        "macAddress": "00:04:7D:03:95:05",\
        "modelNumber": "9W-H3-3MH-DP1-B",\
        "userName": "username",\
        "password": "password",\
        "headNum": 3,\
        "type": "A"\
    }\
]

## To Run The Application
Perform the following:
* Set `HOST` value and `PORT` value in the client/.env file  
  Specifically for GT Police in .ENV file `HOST='vmsbot.gatech.edu'`, `PORT=3200` and in setupProxy.js file `target:"http://172.23.4.188:5001"`
* Inside the `setupProxy.js` file add the ip address of your server or localhost running on the server
* Inside the root directory run the command `npm run dev`

Configure Robo3T
You may want to configure Robo3T or other Document Database UI to view files as the number of files could get quite lengthy
Connection Settings
  Address localhost : 27017
SSH
  SSH Address: 130.207.68.164 : 22
  usernmame
  password

## Background Information
The video maintenance system bot(VMSBOT) purpose is to troubleshoot any malfunctioning camera and generate a service request that gets sent to the appropriate camera vendor, so they can fix the issue. 

There are roughly 2000 security cameras located around the GT campus that currently rely on dispatchers or building managers to identify faulty cameras during monthly inspections.  

This often leads to delays and other inefficiency issues for GTPD which hinders them from keeping the campus as safe as possible. Moreover, there is additional time required to further identify the problem that lies within each of the malfunctioning camera and to contact the appropriate vendor. By developing this bot, it will reduce the time needed to manually complete all the necessary steps to bring a faulty camera back to normal operation.  

The primary user of this product would be the IT employees of GTPD who are responsible for supervising the condition of the security cameras. 

## Software Features
Below are features of the VMSBOT
* Can be ran at any specified times daily through the scheduler or manually at any time 
* After the bot is finished running, it will check each individual camera for maintenance issues. 
* Whenever a malfunctioning camera is found, the bot will then attempt to do basic troubleshooting to try and identify the specific problem (i.e. ping tests for connectivity, etc.). 
    * Once complete, you will be able to generate separate pdf reports for: 
        * a) a list of faulty cameras 
        * b) a list of working cameras
        * c) a list of cameras for certain dates 
        * d) any of the above just for pictures

After the bot is finished running, the user can then examine the service requests the bot was able to generate as well as create service requests for the cameras the bot was unable to troubleshoot. The user will also have access to previous results from the bot running so that the user can ensure faulty cameras eventually get serviced. Our product will decrease the amount of time dedicated to tedious and repeated work as well as the amount of time that faulty cameras remain inactive.


## Dependencies  
see `package.json` file in both the root directory and client directory
`node version 8.11.3`
