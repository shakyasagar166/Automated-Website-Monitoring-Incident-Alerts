ALERT_TEMPLATES = {
    "P0_OUTAGE": {
        "title": "[CRITICAL P0] Complete Service Outage",
        "description": "Endpoint has failed health checks from 3 consecutive global regions."
    },
    "HIGH_LATENCY": {
        "title": "[WARNING P2] High Latency Threshold Exceeded",
        "description": "Response duration exceeded 2,500ms baseline."
    },
    "SSL_EXPIRY": {
        "title": "[ACTION P3] SSL Certificate Expiring Soon",
        "description": "SSL certificate will expire in less than 15 days."
    }
}
