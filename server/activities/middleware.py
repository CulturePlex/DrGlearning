import base64

from django.utils import simplejson
from io import BytesIO
from StringIO import StringIO
from PIL import Image


TARGET_FIELDS = (
    ("/api/v1/activity/", ("image",)),
)


class Base64ImageSizer(object):

    def process_response(self, request, response):
        ext_jsonp_str = request.GET.get("callback")
        if not ext_jsonp_str:
            return response
        # Detect with re if petition is modificable
        for tf in TARGET_FIELDS:
            if request.path.startswith(tf[0]):
                json_str = response.content[len(ext_jsonp_str)+1:-1]
                json = simplejson.loads(json_str)
                for field in [f for f in json if f in tf[1]]:
                    if 'deviceWidth' in request.GET and \
                            'deviceHeight' in request.GET:
                        maximum_size = min((int(request.GET['deviceWidth']),
                                        int(request.GET['deviceHeight'])))
                        size = maximum_size, maximum_size
                        image_data = json[field].split('base64,')[1]
                        image = BytesIO(base64.b64decode(image_data))
                        im = Image.open(image)
                        im.thumbnail(size)
                        output = StringIO()
                        im.save(output, format="PNG")
                        json[field] = "data:image/png;base64,%s" % \
                                        base64.encodestring(output.getvalue())
                        response.content = "%s(%s)" % (ext_jsonp_str,
                                                       simplejson.dumps(json))
        return response
