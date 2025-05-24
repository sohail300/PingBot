email_format = {
    "subject": "🚨 Endpoint Down Alert: {endpoint_name}",
    "body": (
        "Hello {user_name},\n\n"
        "We detected that your monitored endpoint is currently unreachable:\n\n"
        "🔗 URL: {endpoint_url}\n"
        "⏱️ Time: {timestamp}\n"
        "📄 Status: Failed (HTTP {status_code})\n\n"
        "We will continue monitoring and notify you of any further changes.\n\n"
        "Regards,\n"
        "PingBot Team"
    )
}
