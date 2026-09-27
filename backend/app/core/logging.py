import logging
import sys
import json
import time
from typing import Any, Dict

class StructuredFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        if hasattr(record, "processing_time_ms"):
            log_data["processing_time_ms"] = record.processing_time_ms
        if hasattr(record, "retrieval_count"):
            log_data["retrieval_count"] = record.retrieval_count
        if hasattr(record, "assessment"):
            log_data["assessment"] = record.assessment
        if hasattr(record, "error_category"):
            log_data["error_category"] = record.error_category

        return json.dumps(log_data)

def setup_logging():
    logger = logging.getLogger("truthlens")
    logger.setLevel(logging.INFO)
    
    # Avoid duplicate handlers if reloaded
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(StructuredFormatter())
        logger.addHandler(handler)
        
    return logger

logger = setup_logging()
