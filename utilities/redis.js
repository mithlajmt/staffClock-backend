const redis = require('redis');

// Create a Redis client with specified host, port, and password
const client = redis.createClient({
    password: 'LMUcins3yPGjWbYzRo9K5QVcoidwIGju',
    socket: {
        host: 'redis-16284.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 16284
    }
});

// Handle connection events
client.on('connect', () => {
    console.log('Redis Client Connected');
});

client.on('error', (err) => {
    console.log('Redis Client Error', err);
});

// Connect the client
(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error('Could not connect to Redis', err);
    }
})();

module.exports = client;
