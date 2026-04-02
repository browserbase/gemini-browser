import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/session",
      method: "POST",
      advancedOptions: {
        checkLevel: "deepAnalysis",
      },
    },
  ],
});
