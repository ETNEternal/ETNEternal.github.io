import os
import re


def update_images_list():
    # Directory containing the images
    image_dir = "past events"
    # Path to main.js
    js_file_path = os.path.join("js", "main.js")

    # Get list of image files from directory
    try:
        image_files = [
            f
            for f in os.listdir(image_dir)
            if f.lower().endswith((".jpeg", ".jpg", ".webp", ".png"))
        ]
        image_files.sort()  # Sort files alphabetically
    except FileNotFoundError:
        print(f"Error: Directory '{image_dir}' not found")
        return

    # Read the current main.js file
    try:
        with open(js_file_path, "r", encoding="utf-8") as file:
            content = file.read()
    except FileNotFoundError:
        print(f"Error: {js_file_path} file not found")
        return

    # Find the pastEventFiles array in the JavaScript code
    pattern = r"(const\s+pastEventFiles\s*=\s*\[)[^\]]*(\])"

    # Create the new array content
    new_array_content = ",\n            ".join(f"'{file}'" for file in image_files)

    # Replace the array content
    if re.search(pattern, content):
        updated_content = re.sub(
            pattern, f"\\1\n            {new_array_content}\n        \\2", content
        )

        # Write the updated content back to main.js
        with open(js_file_path, "w", encoding="utf-8") as file:
            file.write(updated_content)

        print(f"Successfully updated {js_file_path}")
        print(f"Updated image list with {len(image_files)} images:")
        for image in image_files:
            print(f"- {image}")
    else:
        print(f"Error: pastEventFiles array not found in {js_file_path}")


if __name__ == "__main__":
    update_images_list()
