from main import app
from flask import render_template

@app.route('/')
def homepage():
    return render_template("index.html")

@app.route('/configuracoes')
def configuracoes():
    return render_template("configuracoes.html")

@app.route('/ajuda')
def ajuda():
    return render_template("ajuda.html")

@app.route('/main')
def index():
    return render_template("main.html")

@app.route('/sobre')
def sobre():
    return render_template("sobre.html")

@app.route('/traduzir')
def traduzir():
    return render_template("traduzir.html")

