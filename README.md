# Web Services for Propnight
This repository contains code for emulating Fntastic's Propnight server and basic PlayFab Web API server

Both `backend.mjs` and `playfab.mjs` accept `--log-requests` argument for logging incoming requests from Propnight to console

> [!WARNING]
> This repository doesn't contain any code that modifies your game. You need to be able to launch game with Steam or install emulator (e.g. Goldberg Emulator) in order to reach point where Propnight will try to contact web services.

## Manual install
1. Install [Node.js](https://nodejs.org)
2. Install [nginx](https://nginx.org)
3. Get 2 self-signed certificates (search for a guide how to issue them if you need to):  
    - First (backend) for `ddkkakl4x2.execute-api.eu-central-1.amazonaws.com`  
    - Second (playfab) for `23b52.playfabapi.com`
4. Create directory `certs` in nginx's directory. You directory layout should be like this:
    ```
    nginx
     |-certs
     |  |-backend.crt
     |  |-backend.key
     |  |-playfab.crt
     |  |-playfab.key
     |
     |-conf
     |  |-nginx.conf
     |  ...
     |
     ...
    ```
5. Replace nginx config file at `conf` directory with provided in this repository
6. Add following to your `hosts` file:
    ```
    127.0.0.1 ddkkakl4x2.execute-api.eu-central-1.amazonaws.com
    127.0.0.1 23b52.playfabapi.com
    ```

## Running servers
1. Start nginx
2. Start backend server with `node backend.mjs`
3. Start PlayFab server with `node playfab.mjs`

## Having issues?
You can open new issue on GitHub to let me know if something is unclear or not working as it should be.
