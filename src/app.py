#!flask/bin/python
# -*- coding: utf-8 -*-

from app import app
import sys

reload(sys)
sys.setdefaultencoding('utf8')

app.run(debug=True,host='0.0.0.0', port=80)
