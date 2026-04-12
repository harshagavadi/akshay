import serverless from "serverless-http";
import app from "../../server/index";

const handler = serverless(app, {
  request(req: any, event: any) {
    req.event = event;
  },
});

export { handler };
