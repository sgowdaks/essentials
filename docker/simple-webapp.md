## Project Structure

```
mkdir simple-webapp
cd simple-webapp
mkdir app
touch app/index.html app/style.css app/app.js Dockerfile nginx.conf
```

## Web App Files

### app/index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Simple Web App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Hello from Dockerized Web App!</h1>
  <button onclick="sayHello()">Click Me</button>
  <script src="app.js"></script>
</body>
</html>
```

### app/stype.css

```
body {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}
```

### app/app.js

```
function sayHello() {
  alert("Hello from JavaScript!");
}
```


## Create Nginx Config

### nginx.conf

```
events {}

http {
  server {
    listen 80;
    location / {
      root /usr/share/nginx/html;
      index index.html;
    }
  }
}
```

## Create Dockerfile

```
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY app/ /usr/share/nginx/html
```

### Build and Run the Docker Container

```
docker build -t simple-webapp .
docker run -d -p 8080:80 simple-webapp
```

Now open your browser and go to http://localhost:8080 to see your app in action!
