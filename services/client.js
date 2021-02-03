const client = require('contentful').createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const writeClient = require('contentful-management').createClient({
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_PERSONAL_ACCESS_TOKEN,
});

export { client, writeClient };
