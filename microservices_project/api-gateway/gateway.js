
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { trace } = require('@opentelemetry/api');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

// Configuration du traçage
const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'api-gateway',
    }),
});

// Configuration de l'exportateur Jaeger
const exporter = new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
});

// Ajout du processeur de spans avec l'exportateur Jaeger
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// Enregistrement des instrumentations automatiques
registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
    ],
});

const tracer = trace.getTracer('api-gateway-tracer');

// Initialize express
const app = express();

// Middleware for CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Trace middleware
// Trace middleware
app.use((req, res, next) => {
    const span = tracer.startSpan('gateway_request');
    span.setAttribute('http.method', req.method);
    span.setAttribute('http.url', req.url);

    // Déterminer le service
    const getServiceName = () => {
        const path = req.baseUrl; // req.path ou req.baseUrl
        if (path.startsWith('/users')) return 'User Service';
        if (path.startsWith('/products')) return 'Product Service';
        if (path.startsWith('/orders')) return 'Order Service';
        if (path.startsWith('/notifications')) return 'Notification Service';
        if (path.startsWith('/employees')) return 'Employee Service';
        return 'API Gateway';
    };

    span.setAttribute('service.name', getServiceName());

    res.on('finish', () => {
        span.setAttribute('http.status_code', res.statusCode);
        span.end();
    });

    next();
});

// Proxy middleware for different services
app.use('/users', createProxyMiddleware({
    target: 'http://user-service:5000',
    changeOrigin: true,
    onError: (err, req, res) => {
        const span = trace.getSpan(trace.getActiveContext());
        if (span) {
            span.setAttribute('error', true);
            span.recordException(err);
        }
        res.status(500).send('Erreur avec le service Users');
    }
}));

app.use('/products', createProxyMiddleware({
    target: 'http://product-service:5003',
    changeOrigin: true,
    pathRewrite: {
        '^/products': '/products'  //ou api/products
    },
    onError: (err, req, res) => {
        const span = trace.getSpan(trace.getActiveContext());
        if (span) {
            span.setAttribute('error', true);
            span.recordException(err);
        }
        res.status(500).send('Erreur avec le service Products');
    }
}));

app.use('/orders', createProxyMiddleware({
    target: 'http://order-service:5002',
    changeOrigin: true,
    onError: (err, req, res) => {
        const span = trace.getSpan(trace.getActiveContext());
        if (span) {
            span.setAttribute('error', true);
            span.recordException(err);
        }
        res.status(500).send('Erreur avec le service Orders');
    }
}));

app.use('/notifications', createProxyMiddleware({
    target: 'http://notification-service:5001',
    changeOrigin: true,
    onError: (err, req, res) => {
        const span = trace.getSpan(trace.getActiveContext());
        if (span) {
            span.setAttribute('error', true);
            span.recordException(err);
        }
        res.status(500).send('Erreur avec le service Notifications');
    }
}));

app.use('/employees', createProxyMiddleware({
    target: 'http://employee-service:5004',
    changeOrigin: true,
    onError: (err, req, res) => {
        const span = trace.getSpan(trace.getActiveContext());
        if (span) {
            span.setAttribute('error', true);
            span.recordException(err);
        }
        res.status(500).send('Erreur avec le service Employees');
    }
}));

// Global error handler
app.use((err, req, res, next) => {
    const span = trace.getSpan(trace.getActiveContext());
    if (span) {
        span.setAttribute('error', true);
        span.recordException(err);
    }
    res.status(500).send('Erreur interne du serveur');
});

// Server start on port 8080
app.listen(8080, () => {
    console.log("API Gateway running on port 8080");
});