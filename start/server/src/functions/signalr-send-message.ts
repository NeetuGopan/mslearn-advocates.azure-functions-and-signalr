import { app, output, CosmosDBv4FunctionOptions, InvocationContext } from "@azure/functions";

const goingOutToSignalR = output.generic({
    type: 'signalR',
    name: 'signalR',
    hubName: 'default',
    connectionStringSetting: 'Endpoint=https://msl-sigr-signalr8662c1e515.service.signalr.net;AccessKey=7Oy6OgxTGdIN5jesoYswBHEzZnw3Eh4HjavdkkiOgjgmB48SXH8DJQQJ99BCACHYHv6XJ3w3AAAAASRS3L3e;Version=1.0;',
});

export async function dataToMessage(documents: unknown[], context: InvocationContext): Promise<void> {

    try {

        context.log(`Documents: ${JSON.stringify(documents)}`);

        documents.map(stock => {
            // @ts-ignore
            context.log(`Get price ${stock.symbol} ${stock.price}`);
            context.extraOutputs.set(goingOutToSignalR,
                {
                    'target': 'updated',
                    'arguments': [stock]
                });
        });
    } catch (error) {
        context.log(`Error: ${error}`);
    }
}

const options: CosmosDBv4FunctionOptions = {
    connection: 'AccountEndpoint=https://signalr-cosmos-9a135cabfa.documents.azure.com:443/;AccountKey=8pdZ1osNcVJUhlLNyiJyb0nJYqwqhDdX3NW0OeMix5ZX4iG1YCFX2EEUZHSYunm85POFzkWL71kPACDbrcduSw==;',
    databaseName: 'stocksdb',
    containerName: 'stocks',
    createLeaseContainerIfNotExists: true,
    feedPollDelay: 500,
    handler: dataToMessage,
    extraOutputs: [goingOutToSignalR],
};

app.cosmosDB('send-signalr-messages', options);