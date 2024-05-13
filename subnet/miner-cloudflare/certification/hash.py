import hashlib

def hash_multiple_files(file_paths):
    """Generate MD5 hash for the concatenated content of multiple files."""
    md5 = hashlib.md5()
    # Process each file in the list
    for file_path in file_paths:
        # Open each file in binary read mode
        with open(file_path, "rb") as file:
            # Read and update hash string value in blocks of 4K
            for chunk in iter(lambda: file.read(4096), b""):
                md5.update(chunk)
    # Return the hexadecimal MD5 hash of the concatenated content
    return md5.hexdigest()
