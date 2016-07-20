from flask.ext.wtf import Form
from wtforms import StringField, BooleanField, RadioField
from wtforms.validators import DataRequired

class SearchForm(Form):
    namespace = RadioField('Namespace')
