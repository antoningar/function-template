import { APIGatewayProxyEvent } from 'aws-lambda';
import { ExampleService } from './business/example-service';

interface Context {
  clientContext: ClientContext
};

interface ClientContext {
  gc_client_id: string
  gc_client_secret: string
  gc_aws_region: string
};

function validateOAuthCredentials(context: Context): boolean {
  if (!context?.clientContext) {
    return false;
  }

  const { gc_client_id, gc_client_secret, gc_aws_region } = context.clientContext;

  return !!(gc_client_id && gc_client_id.trim() !== '' &&
           gc_client_secret && gc_client_secret.trim() !== '' &&
           gc_aws_region && gc_aws_region.trim() !== '');
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));

    if (!validateOAuthCredentials(context)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Unauthorized: Invalid or missing OAuth credentials',
          error: 'Missing required OAuth parameters: gc_client_id, gc_client_secret, gc_aws_region',
        }),
      };
    }

    const exampleService = new ExampleService();
    const result = await exampleService.process(context.clientContext);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Function executed successfully',
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