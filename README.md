# Database and Web Technique Project Summer Semester 2021
This project can be found on my github [DBW2021](https://github.com/hieunk58/dbw2021)

This guide will help you set up and run project on local machine.
Project contains two apps: client and server
After download and unzip, go to each folder to install packages.
Make sure you already install npm on your machine.

### SETTING UP

Install packages for client app
### cd client
### npm install

Install packages for server app
### cd server
### npm install

### DATABASE

Database used in this project is on the cloud [MongoDB Atlat](https://www.mongodb.com/cloud/atlas).
I already created a database and configure it in the server.js. 
You are ready to use without further database configuration.
If you like to use local database, please find below lind and replece by your configuration
mongoDB = 'mongodb+srv://hieunk58:123456a@@cluster0.f76yh.mongodb.net/tuc_db?retryWrites=true&w=majority';

### RUNNING
After installing all required packages for both client and server app, you now can run it.
Running server
### cd server
### npm run dev
If you change any codes, server will be reload automatically using nodemon

Running client
### cd client
### npm start
React app also supports reload automatically if there is any changes in our source code.

### CONTACT
If you have any problem with setting up and running my project.
Feel free to contact me by email: khachieunk@gmail.com
Thank you for your time
