from flask import Flask

app = Flask(__name__)

@app.route('/service')
def hello():
  return (f'Hello from behind Envoy proxy!!\n')

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8080, debug=True)
