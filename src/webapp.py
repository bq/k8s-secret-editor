#!flask/bin/python
# -*- coding: utf-8 -*-

from app import app
import sys
from config import *
import os
from git import Repo
from subprocess import call
import time
import shutil

reload(sys)
sys.setdefaultencoding('utf8')

debug = False

if 'DEBUG' in os.environ and os.environ['DEBUG'] == "1":
     debug = True

app.run(debug=debug,host='0.0.0.0', port=80)
