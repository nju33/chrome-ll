import {Handler} from 'aws-lambda';

export const hello: Handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin' : '*'
    },
    body: JSON.stringify({
      message: 'Hello World!',
    }),
  };

  callback(null, response);
};