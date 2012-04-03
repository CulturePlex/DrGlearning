from django import forms


class CareerImportForm(forms.Form):
    activities_file = forms.FileField()
