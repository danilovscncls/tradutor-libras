from main import app
from flask import render_template

@app.route('/')
def homepage():
    return render_template("index.html")
@app.route('/configuracoes.html')
def configuracoes():
    return render_template("configuracoes.html")
@app.route('/ajuda.html')
def ajuda():
    return render_template("ajuda.html")
@app.route('/index.html')
def index():
    return render_template("index.html")
@app.route('/sobre.html')
def sobre():
    return render_template("sobre.html")
@app.route('/traduzir.html')
def traduzir():
    return render_template("traduzir.html")

