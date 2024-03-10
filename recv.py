import socket
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

def receive_and_decrypt():
    # Replace 'server_port' with the actual port you want to use
    server_port = 12345

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.2', server_port))
        s.listen()

        print(f"Listening on port {server_port}...")

        conn, addr = s.accept()
        with conn:
            print(f"Connected by {addr}")

            data = conn.recv(4096)  # Adjust buffer size as needed

            # Replace 'your_aes_key' with the actual key used for encryption in the previous step
            key = b'Sixteen byte key'  # Use the same key as in the encryption process
            cipher = Cipher(algorithms.AES(key), modes.ECB(), backend=default_backend())
            decryptor = cipher.decryptor()
            decrypted_data = decryptor.update(data) + decryptor.finalize()

            print(f"Received and decrypted data: {decrypted_data.decode()}")

if __name__ == "__main__":
    receive_and_decrypt()
