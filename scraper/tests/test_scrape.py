import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from scrape import build_post_record


def _make_item(
    code="ABC123",
    caption="Summer drop #labelgabriel #fashion @brandx",
    taken_at=1710504000,
    media_type=1,
):
    return {
        "code": code,
        "taken_at": taken_at,
        "media_type": media_type,
        "caption": {"text": caption} if caption else None,
        "image_versions2": {
            "candidates": [{"url": "https://example.com/img.jpg", "width": 1080, "height": 1350}]
        },
    }


def test_build_post_record_extracts_all_fields():
    record = build_post_record(_make_item())

    assert record["id"] == "ABC123"
    assert record["timestamp"] == 1710504000
    assert record["caption"] == "Summer drop #labelgabriel #fashion @brandx"
    assert "labelgabriel" in record["hashtags"]
    assert "fashion" in record["hashtags"]
    assert "brandx" in record["mentions"]
    assert record["is_video"] is False
    assert record["image_filename"] == "ABC123.jpg"
    assert record["_image_url"] == "https://example.com/img.jpg"


def test_build_post_record_handles_null_caption():
    item = _make_item()
    item["caption"] = None
    record = build_post_record(item)

    assert record["caption"] == ""
    assert record["hashtags"] == []
    assert record["mentions"] == []


def test_build_post_record_video_media_type():
    record = build_post_record(_make_item(media_type=2))
    assert record["is_video"] is True


def test_build_post_record_carousel_uses_first_image():
    item = _make_item()
    item["carousel_media"] = [
        {
            "image_versions2": {
                "candidates": [{"url": "https://example.com/carousel0.jpg", "width": 1080, "height": 1350}]
            }
        }
    ]
    record = build_post_record(item)
    assert record["_image_url"] == "https://example.com/carousel0.jpg"
