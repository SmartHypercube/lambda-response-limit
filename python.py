import json
import random

max_result_length = 6291556
def result_length(r):
    return len(json.dumps(r, ensure_ascii=False).encode())

def handler(event, context):
    n = int(event['queryStringParameters']['n'])
    result = {}
    for i in range(1000):
        result[i] = i
    for i in range(1000):
        s = ''
        for j in range(random.randrange(1, 10)):
            s += random.choice(['一', '€', 'ó', '𨉟', '🇨🇳', '𝄞', '/', '\\', "'", '"', '\n', '\t', ' ', '\0', '\b'])
        result[f'{s}{i}'] = f'{s}{i}'
    result['s'] = ''
    result['s'] = 'a' * (n - result_length(result))
    if result_length(result) != n:
        return {'statusCode': 500, 'body': 'impossible'}
    return result
