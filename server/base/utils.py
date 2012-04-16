import base64

from django.db.models.fields import DateTimeField
from django.db.models.fields.files import ImageField
from django.contrib.gis.db.models import GeometryField


MAX_IMAGE_SIZE = 1024


def jsonify_fields(instance, fields=None):
    DEBUG = False
    data = {}
    if fields:
        fields = fields
    else:
        DEBUG = True
        fields = instance._meta.fields

    for f in fields:
        field_name = f.name
        # If image convert to base64
        if isinstance(f, ImageField):
            image = getattr(instance, field_name)
            if not image:
                # TODO Should we send the field with a blank value?
                continue
            
            # Original url for debugging
            if DEBUG:
                data[field_name+'_url'] = image

            # base64 transformation
            image_path = image.path
            ext = image_path.split('.')[-1]
            image_data = open(image_path,"rb").read()
            data[field_name] = "data:image/%s;base64,%s" % (ext,
                    base64.encodestring(image_data))
        # If geometry export to geojson
        elif isinstance(f, GeometryField):
            geo_object = getattr(instance, field_name)
            data[field_name] = geo_object.geojson
        elif isinstance(f, DateTimeField):
            data[field_name] = getattr(instance, field_name).isoformat()
        else:
            data[field_name] = getattr(instance, field_name)
    return data


def dehydrate_fields(bundle, child_obj=None):
    if not child_obj:
        child_obj = bundle.obj
    bundle.data.update(jsonify_fields(child_obj))
    return bundle


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



