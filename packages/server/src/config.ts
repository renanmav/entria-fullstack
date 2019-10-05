const ENV = process.env;

// Database Settings
const dBdevelopment = ENV.MONGO_URL || 'mongodb://admin:entria12345678@ds163757.mlab.com:63757/twitter-relay';
const dBproduction = ENV.MONGO_URL || 'mongodb://admin:entria12345678@ds163757.mlab.com:63757/twitter-relay';

// Test Database Settings
// const test = 'mongodb://localhost/awesome-test';

// Export DB Settings
export const databaseConfig = ENV.NODE_ENV === 'production' ? dBproduction : dBdevelopment;

// Export GraphQL Server settings
export const graphqlPort = ENV.PORT || 5000;
export const jwtSecret = ENV.JWT_KEY || 'secret_key';
