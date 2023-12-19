'use strict';

const maxResultLength = 6291556;
function resultLength(r) {
  return Buffer.byteLength(JSON.stringify(r));
}

export async function handler(event, context) {
  const n = Number(event.queryStringParameters.n);
  const result = {};
  for (let i = 0; i < 1000; i++) {
    result[i] = i;
  }
  for (let i = 0; i < 1000; i++) {
    let s = '';
    for (let j = 0; j < Math.floor(Math.random() * 10) + 1; j++) {
      s += ['一', '€', 'ó', '𨉟', '🇨🇳', '𝄞', '/', '\\', "'", '"', '\n', '\t', ' ', '\0', '\b'][Math.floor(Math.random() * 15)];
    }
    result[s + i] = s + i;
  }
  result.s = '';
  result.s = 'a'.repeat(n - resultLength(result));
  if (resultLength(result) !== n) {
    return {statusCode: 500, body: 'impossible'};
  }
  return result;
}
