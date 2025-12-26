import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1000'],
  },
};

const shortenerUrl = __ENV.SHORTENER_URL || 'http://localhost:5001';
const redirectorUrl = __ENV.REDIRECTOR_URL || 'http://localhost:3000';
const longUrlBase = __ENV.LONG_URL_BASE || 'https://example.com';

export default function () {
  const longUrl = `${longUrlBase}/${__VU}-${__ITER}-${Date.now()}`;
  const shortenRes = http.post(
    `${shortenerUrl}/shorten`,
    JSON.stringify({ url: longUrl }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const shortenOk = check(shortenRes, {
    'shorten status 201': (r) => r.status === 201,
  });

  if (!shortenOk) {
    sleep(0.1);
    return;
  }

  let code = '';
  try {
    code = JSON.parse(shortenRes.body).code || '';
  } catch (err) {
    code = '';
  }

  if (!code) {
    sleep(0.1);
    return;
  }

  const redirectRes = http.get(`${redirectorUrl}/${code}`, { redirects: 0 });
  check(redirectRes, {
    'redirect status 302': (r) => r.status === 302,
    'redirect location matches': (r) => r.headers.Location === longUrl,
  });

  sleep(0.1);
}
