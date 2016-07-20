#!/usr/bin/env python
# -*- coding: utf-8 -*-
from requests.auth import HTTPDigestAuth
from functools import wraps
from flask import render_template, flash, redirect, request, send_from_directory, Response
from app import app
#from .forms import SearchForm
import requests
import json
import yaml
import pprint
import base64
import os
from git import Repo
from config import *

def check_auth(username, password):
    """This function is called to check if a username /
    password combination is valid.
    """

    # If ADMIN_PASSWORD defined, then check that password is correct
    if 'ADMIN_PASSWORD' in os.environ and os.environ['ADMIN_PASSWORD'] != '':
        return username == 'admin' and password == os.environ['ADMIN_PASSWORD']
    else:
        return True

def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response(
    'Could not verify your access level for that URL.\n'
    'You have to login with proper credentials', 401,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

# Custom static data
@app.route('/css/<path:filename>')
def custom_static_css(filename):
    return send_from_directory(app.root_path + '/static/css/', filename)

# Custom static data
@app.route('/js/<path:filename>')
def custom_static_js(filename):
    return send_from_directory(app.root_path + '/static/js/', filename)

# Custom static data
@app.route('/fonts/<path:filename>')
def custom_static_fonts(filename):
    return send_from_directory(app.root_path + '/static/fonts/', filename)

# Custom static data
@app.route('/codemirror/<path:filename>')
def custom_static_codemirror(filename):
    return send_from_directory(app.root_path + '/codemirror/', filename)

# Custom static data
@app.route('/static/<path:filename>')
def custom_static_(filename):
    return send_from_directory(app.root_path + '/static/', filename)


def read_api(query):
    k8s_token = open('/var/run/secrets/kubernetes.io/serviceaccount/token').read()
    ip = os.getenv('KUBERNETES_SERVICE_HOST','127.0.0.1')
    port = os.getenv('KUBERNETES_PORT_443_TCP_PORT','443')
    response = requests.get('https://' + ip + ':' + port + query,
                                verify=False,
                                headers={'Authorization':'Bearer ' + k8s_token})
    return response

def post_api(query,data):
    k8s_token = open('/var/run/secrets/kubernetes.io/serviceaccount/token').read()
    ip = os.getenv('KUBERNETES_SERVICE_HOST','127.0.0.1')
    port = os.getenv('KUBERNETES_PORT_443_TCP_PORT','443')
    response = requests.post('https://' + ip + ':' + port + query,
                                verify=False,
                                headers={'Authorization':'Bearer ' + k8s_token, 'content-type': 'application/json'},
                                data=data)
    return response

def delete_api(query):
    k8s_token = open('/var/run/secrets/kubernetes.io/serviceaccount/token').read()
    ip = os.getenv('KUBERNETES_SERVICE_HOST','127.0.0.1')
    port = os.getenv('KUBERNETES_PORT_443_TCP_PORT','443')
    response = requests.delete('https://' + ip + ':' + port + query,
                                verify=False,
                                headers={'Authorization':'Bearer ' + k8s_token})
    return response


@app.route('/', methods=['GET'])
@requires_auth
def search_namespaces():
    # namespaces=['nm1','nm2','nm3']
    namespaces=[]
    r = read_api('/api/v1/namespaces')
    d = json.loads(r.content)
    for i in d['items']:
        if i['metadata']['name'] != 'kube-system':
            namespaces.append(i['metadata']['name'])
    return render_template('select_namespace.html', namespaces=namespaces, titulo='Selecciona namespace')

@app.route('/<string:namespace>', methods=['GET'])
@requires_auth
def search_secrets(namespace):
    # secrets=['secret-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','secret B', 'secret C']
    # namespaces=['nm1','nm2','nm3']
    namespaces=[]
    secrets=[]
    r = read_api('/api/v1/namespaces/'+namespace+'/secrets')
    d = json.loads(r.content)
    for i in d['items']:
        if 'default-token' not in i['metadata']['name']:
            secrets.append(i['metadata']['name'])
    r = read_api('/api/v1/namespaces')
    d = json.loads(r.content)
    for i in d['items']:
        if i['metadata']['name'] != 'kube-system':
            namespaces.append(i['metadata']['name'])
    return render_template('select_secret.html', namespace=namespace , namespaces=namespaces, secrets=secrets, titulo='Selecciona secret')

@app.route('/<string:namespace>', methods=['POST'])
@requires_auth
def create_secret(namespace):
    request.get_data()
    secret = request.form['secret']
    new = {
          "kind": "Secret",
          "apiVersion": "v1",
          "metadata": {
            "name": secret,
            "namespace": namespace
          },
          "data": {
          },
          "type": "Opaque"
    }
    print new
    rc = post_api('/api/v1/namespaces/'+namespace+'/secrets', data=json.dumps(new))
    #rc = requests.post('https://104.155.45.53/api/v1/namespaces/'+namespace+'/secrets', data=json.dumps(new), headers={'Authorization':'Basic YWRtaW46QWhpSWdPcmRFOXBVdjRHeA==','content-type': 'application/json'}, auth=('admin', 'AhiIgOrdE9pUv4Gx'),verify=False)
    print 'CREATE:'
    print rc.status_code
    print rc.json()
    print rc.content
    if rc.status_code != 201:
        flash('ERROR WHEN CREATING SECRET ' + secret)
        return redirect("/"+namespace)
    else:
        flash('Created secret ' + secret)
        return redirect("/"+namespace+"/"+secret)



@app.route('/<string:namespace>/<string:secret>', methods=['GET'])
@requires_auth
def edit_secret(namespace,secret):
    namespaces=[]
    secrets=[]
    r = read_api('/api/v1/namespaces/'+namespace+'/secrets')
    d = json.loads(r.content)
    for i in d['items']:
        if 'default-token' not in i['metadata']['name']:
            secrets.append(i['metadata']['name'])
    r = read_api('/api/v1/namespaces')
    d = json.loads(r.content)
    for i in d['items']:
        if i['metadata']['name'] != 'kube-system':
            namespaces.append(i['metadata']['name'])

    r = read_api('/api/v1/namespaces/'+namespace+'/secrets/'+secret)
    if r.status_code == 200:
        d = json.loads(r.content)
        pprint.pprint(d)
        data={}
        if 'data' in d:
            for x in d['data']:
                data[x] = base64.b64decode(d['data'][x])
                print data[x]
        return render_template('edit_secret.html',namespaces=namespaces, secrets=secrets, namespace=d['metadata']['namespace'], secret=d['metadata']['name'], data=data, titulo='Edit secret', errors='')
    else:
        return render_template('select_secret.html', namespaces=namespaces, secrets=secrets, namespace=namespace, titulo='Select secret', error='Secret does not exist in selected namespace')


@app.route('/<string:namespace>/<string:secret>', methods=['POST'])
@requires_auth
def submit_secret(namespace,secret):
        request.get_data()
        data = request.form
        pprint.pprint(data)
        new = {
              "kind": "Secret",
              "apiVersion": "v1",
              "metadata": {
                "name": secret,
                "namespace": namespace
              },
              "data": {
              },
              "type": "Opaque"
        }
        for key in data:
            new["data"][key] = base64.b64encode(data[key].encode('utf-8'))
        body = json.dumps(new, indent=4)
        print body

        #rp = requests.get('https://104.155.45.53/api/v1/namespaces/'+namespace+'/secrets/'+secret, auth=('admin', 'AhiIgOrdE9pUv4Gx'),verify=False)
        rp = read_api('/api/v1/namespaces/'+namespace+'/secrets/'+secret)
        previous = json.loads(rp.content)
        print 'BACKUP:'
        pprint.pprint(previous)

        #rd = requests.delete('https://104.155.45.53/api/v1/namespaces/'+namespace+'/secrets/'+secret, auth=('admin', 'AhiIgOrdE9pUv4Gx'),verify=False)
        rd = delete_api('/api/v1/namespaces/'+namespace+'/secrets/'+secret)
        print 'delete:'
        print rd.status_code
        print rd.json()
        print rd.content

        #rc = requests.post('https://104.155.45.53/api/v1/namespaces/'+namespace+'/secrets', data=body, headers={'Authorization':'Basic YWRtaW46QWhpSWdPcmRFOXBVdjRHeA==','content-type': 'application/json'}, auth=('admin', 'AhiIgOrdE9pUv4Gx'),verify=False)
        rc = post_api('/api/v1/namespaces/'+namespace+'/secrets', data=body)
        print 'CREATE:'
        print rc.status_code
        print rc.json()
        print rc.content

        if rc.status_code != 201:
            #rr = requests.post('https://104.155.45.53/api/v1/namespaces/'+namespace+'/secrets', data=json.dumps(previous), headers={'Authorization':'Basic YWRtaW46QWhpSWdPcmRFOXBVdjRHeA==','content-type': 'application/json'}, auth=('admin', 'AhiIgOrdE9pUv4Gx'),verify=False)
            rr = post_api('/api/v1/namespaces/'+namespace+'/secrets', data=json.dumps(previous))
            print 'RESTORE:'
            print rr.status_code
            print rr.json()

            data={}
            for x in previous['data']:
                data[x] = base64.b64decode(previous['data'][x])
            error = json.loads(rc.content)['message']
            return render_template('edit_secret.html', namespace=namespace, secret=secret, data=data, titulo='Edit secret', errors=error)
        else:
            flash('Updated secret %s in namespace %s' %(secret, namespace))
            return redirect("/"+namespace+"/"+secret)

@app.route('/<string:namespace>/<string:secret>/delete', methods=['GET'])
@requires_auth
def delete_secret(namespace,secret):

    rd = delete_api('/api/v1/namespaces/'+namespace+'/secrets/'+secret)
    print 'delete:'
    print rd.status_code
    print rd.json()
    print rd.content

    namespaces=[]
    secrets=[]
    r = read_api('/api/v1/namespaces/'+namespace+'/secrets')
    d = json.loads(r.content)
    for i in d['items']:
        if 'default-token' not in i['metadata']['name']:
            secrets.append(i['metadata']['name'])
    r = read_api('/api/v1/namespaces')
    d = json.loads(r.content)
    for i in d['items']:
        if i['metadata']['name'] != 'kube-system':
            namespaces.append(i['metadata']['name'])

    if rd.status_code == 200:
        flash('Removed secret: ' + secret)
        return render_template('select_secret.html', namespace=namespace , namespaces=namespaces, secrets=secrets, titulo='Select secret')
    else:
        flash('ERROR WHEN REMOVING SECRET: ' + secret)
        return render_template('select_secret.html', namespace=namespace , namespaces=namespaces, secrets=secrets, titulo='Select secret', error='Secret could not be removed '+secret)

