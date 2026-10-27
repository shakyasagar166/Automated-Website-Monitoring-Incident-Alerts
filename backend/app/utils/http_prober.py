def categorize_http_status(status_code: int) -> str:
    if 200 <= status_code < 300:
        return "SUCCESS"
    if 300 <= status_code < 400:
        return "REDIRECTION"
    if 400 <= status_code < 500:
        return "CLIENT_ERROR"
    if status_code >= 500:
        return "SERVER_FAULT"
    return "NETWORK_TIMEOUT"
