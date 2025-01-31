const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Define any custom metrics, e.g., HTTP request durations
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500]  // Example buckets in milliseconds
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);

// Expose the metrics at '/metrics' endpoint
module.exports = (app) => {
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
}; 