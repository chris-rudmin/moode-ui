# Moode UI

A React based UI for moode

## Building and Running

The webpack bundled site will be built into the `./dist` folder.

You can build the application locally using the command

    npm run build

You can also start the application locally for development purposes using

    npm run start

## Connecting to a MoOde instance remotely

Connect to your moode server, and in the files 

    /var/www/command/moode.php
    /var/www/engine-mpd.php
    /var/www/engine-cmd.php

add the line

    header("Access-Control-Allow-Origin: *");

## Tests

### Unit Tests

    npm test

### UI Component Test

UI Component tests uses an internal Mock Server to serve API endpoint dependencies.
The Mock server will be start on the port 8080. 

    npm run test:e2e
