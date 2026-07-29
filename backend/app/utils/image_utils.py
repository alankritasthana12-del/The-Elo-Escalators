from PIL import Image
import os

def process_and_save_image(upload_file, dest_path: str, max_size: tuple = (800, 800), quality: int = 85) -> str:
    """
    Resizes and compresses an uploaded image before saving.
    Returns the path to the saved image.
    """
    try:
        image = Image.open(upload_file.file)
        
        # Convert to RGB if necessary (e.g. RGBA or P modes)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
            
        # Resize maintaining aspect ratio
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save compressed image
        image.save(dest_path, "JPEG", quality=quality, optimize=True)
        return dest_path
    except Exception as e:
        print(f"Error processing image: {e}")
        # Fallback to direct save
        upload_file.file.seek(0)
        with open(dest_path, "wb") as f:
            f.write(upload_file.file.read())
        return dest_path
