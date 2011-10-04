# Create your views here.

from userena.views import signin, signup
from django.shortcuts import redirect

def signin_redirect(request, *args, **kwargs):
    if request.user.is_authenticated() and request.user.is_superuser:
        return redirect("dashboard")
    return signin(request, *args, **kwargs)


def signup_redirect(request, *args, **kwargs):
    if request.user.is_authenticated() and request.user.is_superuser:
        return signup(request, *args, **kwargs)
    return redirect("index")
