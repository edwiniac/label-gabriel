import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from unittest.mock import MagicMock
from scrape import build_post_record


def test_build_post_record_extracts_all_fields():
    mock_post = MagicMock()
    mock_post.shortcode = "ABC123"
    mock_post.date_utc.isoformat.return_value = "2024-03-15T12:00:00"
    mock_post.caption = "Summer drop #labelgabriel #fashion #minimal"
    mock_post.caption_hashtags = ["labelgabriel", "fashion", "minimal"]
    mock_post.caption_mentions = []
    mock_post.is_video = False
    mock_post.url = "https://example.com/img.jpg"

    record = build_post_record(mock_post)

    assert record["id"] == "ABC123"
    assert record["timestamp"] == "2024-03-15T12:00:00"
    assert record["caption"] == "Summer drop #labelgabriel #fashion #minimal"
    assert record["hashtags"] == ["labelgabriel", "fashion", "minimal"]
    assert record["mentions"] == []
    assert record["is_video"] is False
    assert record["image_filename"] == "ABC123.jpg"


def test_build_post_record_handles_empty_caption():
    mock_post = MagicMock()
    mock_post.shortcode = "XYZ789"
    mock_post.date_utc.isoformat.return_value = "2024-01-01T00:00:00"
    mock_post.caption = None
    mock_post.caption_hashtags = []
    mock_post.caption_mentions = []
    mock_post.is_video = False
    mock_post.url = "https://example.com/img.jpg"

    record = build_post_record(mock_post)

    assert record["caption"] == ""
    assert record["hashtags"] == []
