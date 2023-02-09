#!/usr/bin/env python 


from flask import Flask, request, jsonify
import os
import openai

app = Flask(__name__)
openai.api_key = os.environ['OPENAI_API_KEY']

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Hello, my name is Cypress and how may I be of assistance to you.'
    })

@app.route('/', methods=['POST'])
def generate_text():
    prompt = request.json.get('prompt')
    if prompt is None:
        return jsonify({'error': 'Prompt is required in the request body.'}), 400

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=3000,
        n=1,
        temperature=0.9,
        top_p=1,
        frequency_penalty=0.5,
        presence_penalty=0
    )

    return jsonify({
        'bot': response['choices'][0]['text']
    })

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')

