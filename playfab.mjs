import http from 'node:http'

const PLAYFABAPI_HOST = '23b52.playfabapi.com';
const LISTEN_PORT = 8082;

const logRequests = process.argv.includes('--log-requests');

/**
 * @param {http.IncomingMessage} req
 * @param {http.OutgoingMessage} res
 * @param {any} body
 */
function handlePlayFabAPI(req, res, body) {
    res.writeHead(200);

    if (req.url.startsWith('//Client/LoginWithCustomID')) {
        let cid = body != null ? body.CustomId : 'cid';

        //
        // Required by old versions of Propnight to launch
        //
        res.end(JSON.stringify({
            Code: 200,
            Status: 'OK',
            Data: {
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
                        CustomId: cid,
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
            }
        }));
    } else if (req.url.startsWith('//MultiplayerServer/ListQosServersForTitle')) {
        //
        // Required to launch game
        //
        res.end(JSON.stringify({
            Code: 200,
            Status: 'OK',
            Data: {
                PageSize: 1,
                QosServers: [
                    {
                        Region: 'EastUs',
                        ServerUrl: 'example.com'
                    }
                ],
                SkipToken: null
            }
        }));
    } else if (req.url.startsWith('/Authentication/GetEntityToken')) {
        //
        // Requested by game server
        //
        res.end(JSON.stringify({
            Code: 200,
            Status: 'OK',
            Data: {
                Entity: body.Entity,
                EntityToken: 'GeneratedEntityToken',
                TokenExpiration: '2025-12-12T12:12:12Z'
            }
        }));
    } else if (req.url.startsWith('/Match/GetMatch')) {
        //
        // Requested by game server
        //
        res.end(JSON.stringify({
            ArrangementString: 'arrString',
            MatchId: 'someid',
            Members: [],
            RegionPreferences: ['EastUs'],
            ServerDetails: {
                Fqdn: '127.0.0.1',
                IPV4Address: '127.0.0.1',
                Ports: [
                    {
                        Name: 'game',
                        Num: 7777
                    }
                ],
                Region: 'EastUs',
                ServerId: 'GeneratedServerId'
            }
        }));
    } else {
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
            console.log('X-SecretKey:', req.headers['X-SecretKey']);
            console.log('X-EntityToken:', req.headers['X-EntityToken']);
            console.log('BODY:', data);
        }

        if (req.headers.host === PLAYFABAPI_HOST) {
            handlePlayFabAPI(req, res, body);
        } else {
            res.end('{}');
        }
    });
});

server.on('listening', () => {
    console.log('Listening as', PLAYFABAPI_HOST, 'on port', LISTEN_PORT);
});

server.listen(LISTEN_PORT);
