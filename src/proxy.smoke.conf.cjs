const apiPort = process.env.FRONTEND_SMOKE_API_PORT ?? '43111';

module.exports = {
  '/graphql': {
    target: `http://127.0.0.1:${apiPort}`,
    secure: false,
  },
};
