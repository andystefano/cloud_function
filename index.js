const functions = require('@google-cloud/functions-framework');

functions.http('create-send-email-task', (req, res) => {
  res.send(`Hello ${req.query.name || req.body.name || 'World'}!`);
});
