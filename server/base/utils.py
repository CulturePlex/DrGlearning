def image_resize(self):
    if hasattr(self, "image") and self.image:
        if self.image.width > MAX_IMAGE_SIZE or \
                self.image.height > MAX_IMAGE_SIZE:
            filename = self.image.name
            small_image = Image.open(StringIO(self.image.read()))
            small_image.thumbnail((MAX_IMAGE_SIZE,
                                    MAX_IMAGE_SIZE))
            temp_file = StringIO()
            file_extension = os.path.splitext(filename)[1][1:]
            if file_extension.lower() == "jpg":
                file_extension = "jpeg"
            small_image.save(temp_file, file_extension)
            image_content = ContentFile(temp_file.getvalue())
            self.image.save(filename, image_content)
    return self



