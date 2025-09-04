import { APIGatewayProxyEvent } from 'aws-lambda';
import { ExampleService } from '../business/example-service';

interface Context {
  clientContext: ClientContext
};

interface ClientContext {
  gc_client_id: string
  gc_client_secret: string
  gc_aws_region: string
};

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));

    const exampleService = new ExampleService();
    const result = await exampleService.process(event.body);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Function executed successfully',
        result: result,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

// CLI runner
if (require.main === module) {
  const fakeEvent: APIGatewayProxyEvent = {
    body: process.argv[2] || '{"test": "data"}',
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/test',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '/test'
  };

  const fakeContext: Context = {
    clientContext: {
      gc_client_id: '',
      gc_client_secret: '',
      gc_aws_region: 'us-east-1'
    }
  };

  handler(fakeEvent, fakeContext)
    .then(result => {
      console.log('Result:', JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}