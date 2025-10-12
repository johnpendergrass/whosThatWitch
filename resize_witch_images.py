#!/usr/bin/env python3
"""
Resize Witch Images Script

This script resizes all PNG images from the witches folder into three standard sizes:
- 70x70 pixels (saved to 70sized folder with _70 suffix)
- 132x132 pixels (saved to 132sized folder with _132 suffix)
- 176x176 pixels (saved to 176sized folder with _176 suffix)

The images will be stretched/squashed to fit the square dimensions.
"""

from PIL import Image
import os
from pathlib import Path


def resize_images():
    """
    Main function to resize all witch images to all three target sizes.
    """
    # Define folder paths
    source_folder = Path("assets/witches")
    folder_70 = Path("assets/70sized")
    folder_132 = Path("assets/132sized")
    folder_176 = Path("assets/176sized")

    # Get all PNG files from source folder
    png_files = list(source_folder.glob("*.png"))
    total_files = len(png_files)

    print(f"Found {total_files} PNG files to process")
    print("-" * 50)

    # Counter for successful conversions
    success_count = 0

    # Process each image
    for index, png_file in enumerate(png_files, 1):
        try:
            # Open the original image
            img = Image.open(png_file)

            # Get the base filename without extension
            base_name = png_file.stem  # e.g., "Elphaba(Broadway_Oz)01"

            # Create 70x70 version
            img_70 = img.resize((70, 70), Image.Resampling.LANCZOS)
            output_70 = folder_70 / f"{base_name}_70.png"
            img_70.save(output_70, "PNG")

            # Create 132x132 version
            img_132 = img.resize((132, 132), Image.Resampling.LANCZOS)
            output_132 = folder_132 / f"{base_name}_132.png"
            img_132.save(output_132, "PNG")

            # Create 176x176 version
            img_176 = img.resize((176, 176), Image.Resampling.LANCZOS)
            output_176 = folder_176 / f"{base_name}_176.png"
            img_176.save(output_176, "PNG")

            # Print progress
            print(f"[{index}/{total_files}] Processed: {png_file.name}")

            success_count += 1

        except Exception as e:
            print(f"[{index}/{total_files}] ERROR processing {png_file.name}: {e}")

    # Summary
    print("-" * 50)
    print(f"Completed: {success_count}/{total_files} images successfully resized")
    print(f"Output: {success_count} images in 70sized folder")
    print(f"Output: {success_count} images in 132sized folder")
    print(f"Output: {success_count} images in 176sized folder")


if __name__ == "__main__":
    print("=" * 50)
    print("Witch Image Resizer")
    print("=" * 50)
    resize_images()
    print("\nDone!")
