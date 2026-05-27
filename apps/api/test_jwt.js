const { encode, decode } = require('@auth/core/jwt');
async function test() {
  const secret = 'hackathon2026-super-secret';
  const salt = 'authjs.session-token';
  const token = await encode({ token: { id: 'test-id' }, secret, salt });
  console.log('Encoded:', token);
  const decoded = await decode({ token, secret, salt });
  console.log('Decoded:', decoded);
}
test().catch(console.error);
