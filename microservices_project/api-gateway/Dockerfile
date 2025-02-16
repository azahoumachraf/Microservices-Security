FROM node:18
WORKDIR /app
COPY gateway.js .
RUN npm install express http-proxy-middleware cors @opentelemetry/api @opentelemetry/sdk-trace-node @opentelemetry/sdk-trace-base @opentelemetry/exporter-jaeger @opentelemetry/instrumentation-express @opentelemetry/instrumentation-http @opentelemetry/instrumentation
CMD ["node", "gateway.js"]
