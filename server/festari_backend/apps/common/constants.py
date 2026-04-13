# Default limits and constants for media uploads and subscriptions

# Subscription limits
DEFAULT_PROPERTY_LIMIT = 5
DEFAULT_IMAGE_LIMIT = 5
DEFAULT_VIDEO_LIMIT = 1
DEFAULT_FILE_SIZE_MB = 5

# Media file extensions
IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.gif', '.webp')
VIDEO_EXTENSIONS = ('.mp4', '.mov', '.avi', '.wmv', '.mpeg')

# All media extensions
MEDIA_EXTENSIONS = IMAGE_EXTENSIONS + VIDEO_EXTENSIONS

# Supabase media validation
ALLOWED_MEDIA_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
    "video/mpeg",
}
MAX_MEDIA_FILE_SIZE = 50 * 1024 * 1024  # 50MB hard limit