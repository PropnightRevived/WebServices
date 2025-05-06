import http from 'node:http'

const BACKEND_HOST = 'ddkkakl4x2.execute-api.eu-central-1.amazonaws.com';
const LISTEN_PORT = 8081;

const logRequests = process.argv.includes('--log-requests');

/**
 * Build number that is used by game to check for available updates.
 * Game will not allow you to do anything if this number
 * is smaller than game is expecting.
 * 
 * 3018 - Build number of latest Steam release
 */
const BUILD_NUMBER = '3018';

/**
 * @param {http.IncomingMessage} req
 * @param {http.OutgoingMessage} res
 * @param {any} body
 */
function handleBackend(req, res, body) {
    res.writeHead(200);

    if (req.url === '/prod/validateauthsessiontoken') {
        res.end(JSON.stringify({ result: 'SUCCESS' }));
    }
    else if (req.url === '/prod/getactualbuildnumber') {
        res.end(BUILD_NUMBER);
    }
    else if (req.url === '/prod/getbuildsummaries') {
        var buildId = BUILD_NUMBER;
        if (typeof body['BuildNumber'] !== 'undefined') {
            buildId = String(body['BuildNumber']);
        }

        res.end(JSON.stringify({
            Success: true,
            BuildId: buildId
        }));
    }
    else if (req.url === '/prod/auth') {
        res.end(JSON.stringify({
            EntityToken: {
                Entity: {
                    Id: 'UniqueEntity1',
                    Type: 'title_player_account'
                },
                EntityToken: 'EntityTokenForPlayer',
                TokenExpiration: '2025-12-12T12:12:12Z'
            },
            SteamId: '76500000000000000',
            InfoResultPayload: {
                Created: '2024-01-01T12:12:13Z',
                CustomIdInfo: {
                    CustomId: 'cid',
                    PlayFabId: 'UniqueUserIdForPlayFab',
                    PrivateInfo: {
                        Email: 'example@example.com'
                    },
                    Username: 'PropnightPlayer'
                }
            },
            LastLoginTime: '2024-01-01T12:12:12Z',
            NewlyCreated: false,
            PlayFabId: 'UniqueUserIdForPlayFab',
            SessionTicket: 'sessionticketforplayer',
            SettingForUser: {
                GatherDeviceInfo: false,
                GatherFocusInfo: false,
                NeedsAttribution: false
            },
            TreatmentAssignment: {
                Variables: [],
                Variants: []
            }
        }));
    }
    else if (req.url === '/prod/createserver') {
        //
        // Game will try to connect to server at 127.0.0.1:7777
        //
        res.end(JSON.stringify({
            Success: true,
            Key: true,
            Details: {
                BuildId: body.BuildId,
                FQDN: 'localhost',
                IPV4Address: '127.0.0.1',
                Region: body.Regions[0],
                SessionId: body.SessionId,
                Ports: [
                    {
                        Name: 'game',
                        Num: 7777
                    }
                ]
            }
        }));
    }
    else {
        res.end('{}');
    }
}

const server = http.createServer((req, res) => {
    let body = '';

    req.on('data', data => {
        body += data;
    });

    req.on('end', () => {
        let data = body.length !== 0 ? JSON.parse(body) : null;

        if (logRequests) {
            console.log(req.headers.host, req.url);
            console.log('X-Api-Key:', req.headers['x-api-key']);
            console.log('BODY:', data);
        }

        if (req.headers.host === BACKEND_HOST) {
            handleBackend(req, res, data);
        } else {
            res.end('{}');
        }
    });
});

server.on('listening', () => {
    console.log('Listening as', BACKEND_HOST, 'on port', LISTEN_PORT);
});

server.listen(LISTEN_PORT);
