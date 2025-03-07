import { app, input } from '@azure/functions';

const inputSignalR = input.generic({
    type: 'signalRConnectionInfo',
    name: 'connectionInfo',
    hubName: 'default',
    connectionStringSetting: 'Endpoint=https://msl-sigr-signalr8662c1e515.service.signalr.net;AccessKey=7Oy6OgxTGdIN5jesoYswBHEzZnw3Eh4HjavdkkiOgjgmB48SXH8DJQQJ99BCACHYHv6XJ3w3AAAAASRS3L3e;Version=1.0;',
});

app.http('open-signalr-connection', {
    authLevel: 'anonymous',
    handler: (request, context) => {
        return { body: JSON.stringify(context.extraInputs.get(inputSignalR)) }
    },
    route: 'negotiate',
    extraInputs: [inputSignalR]
});