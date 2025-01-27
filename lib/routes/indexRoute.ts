import path from "path";
import {
  Request,
  ReqRefDefaults,
  ResponseToolkit,
  RouteDefMethods,
} from "@hapi/hapi";

export const indexRoute = {
  method: "GET" as RouteDefMethods,
  path: "/",
  options: {
    handler: (
      request: Request<ReqRefDefaults>,
      h: ResponseToolkit<ReqRefDefaults>
    ) => {
      return h.file(path.join(process.cwd(), "static", "index.html"));
    },
  },
};
