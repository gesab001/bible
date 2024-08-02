import subprocess

command = "python3 -m http.server --cgi 8001"

subprocess.call(command, shell=True)