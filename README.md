# Expense Tracker

<p align="center">
   <img src="https://imgur.com/qpTdgtj.png" width="800" height="500">
</p>

<br />
This is a Naruto-themed expense tracker web app built with Node.js, Express & MongoDB. Keep track of your income & expenses and browse the records in different months/types/categoires!
<br/>
<br/>
This project is live on Heroku: https://expense-tracker-naruto.herokuapp.com

You can register your own account or login with Facebook or the default user account:

```
email: user1@example.com
password: 123
```

<br/>

## Features

1. Users are able to register a new account
<p align="center">
   <img src="https://imgur.com/cJiORw2.png" width="800" height="500">
</p>

or login with local, Facebook or Google account

<p align="center">
   <img src="https://imgur.com/wNNvxdc.png" width="800" height="500">
</p>

2. Users are able to browse a list of expense/income records with selecting customized filter

<p align="center">
   <img src="https://imgur.com/qpTdgtj.png" width="800" height="500">
</p>

3. Users are able to create, edit, delete expense/income records

<p align="center">
   <img src="https://imgur.com/AIRsXHO.png" width="800" height="500">
</p>

create

<p align="center">
   <img src="https://imgur.com/Kmyn8Zj.png" width="800" height="500">
</p>

edit

4. Users are able to change their profile picture & user name

<p align="center">
   <img src="https://imgur.com/C4d9GVT.png" width="800" height="500">
</p>

5. Users are able to see their expense/income records in a doughnut chart visualization

<p align="center">
   <img src="https://imgur.com/CMmmC1l.png" width="800" height="500">
</p>

## Prerequisites

1. [Git](https://git-scm.com/downloads)
2. [Node.js](https://nodejs.org/en/)
3. [Express](https://expressjs.com/)
4. [MongoDB](https://www.mongodb.com/)

## Installing

1. Clone this project to your local machine with terminal

```
git clone https://github.com/sherryliao21/expense-tracker.git
```

2. Find the folder of this project and open it with your code editor

```
cd expense-tracker
```

3. Install dependencies

```
npm install
```

4. Add .env file and fill in your credentials

```
FACEBOOK_ID=(your facebook app client id)
FACEBOOK_SECRET=(your facebook app client secret)
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
PORT=3000
SESSION_SECRET=(your app session secret)
MONGODB_URI=(your mongoDB URI)
IMGUR_CLIENT_ID=(your imgur client id)
GOOGLE_CLIENT_ID=(your google app client id)
GOOGLE_CLIENT_SECRET=(your google app client id)
GOOGLE_CALLBACK=http://localhost:3000/auth/google/callback
```

5. Run seeder

```
npm run seed
```

6. Run project

```
npm run start
```

7. Open your browser and enter path

```
localhost:3000
```
