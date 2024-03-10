from flask import Flask, request, jsonify,render_template
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import socket
import json

app = Flask(__name__)
message=""
@app.route('/',methods=['POST','GET'])
def home():
    return render_template("index.html")


@app.route('/preprocess_input', methods=['POST'])
def preprocess_input():
    global message
    data = json.loads(request.data)
    input_value=data["keyword"]
    message+=input_value
    print(f"Received input: ",message,input_value)
    return message

    
@app.route('/process_input', methods=['POST'])
def process_input():
    
    global message
    # Print the input text
    PADDING_BYTE="0"
    message=message+ ((16 - len(message)%16) * PADDING_BYTE)
    # Encrypt the input using AES
    key = b'Sixteen byte key'
    cipher = Cipher(algorithms.AES(key), modes.ECB(), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(message.encode()) + encryptor.finalize()

    # Send the encrypted data to another server through TCP
    send_to_tcp_server(encrypted_data)

    return jsonify({'result': 'Input processed and sent to TCP server'})

def send_to_tcp_server(data):
    # Replace 'tcp_server_address' and 'tcp_server_port' with the actual server details
    tcp_server_address = '127.0.0.2'
    tcp_server_port = 12345

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((tcp_server_address, tcp_server_port))
        s.sendall(data)

if __name__ == '__main__':
    app.run(debug=True)
