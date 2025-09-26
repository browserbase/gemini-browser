// import { parentPort, workerData } from "worker_threads";
// import path from "path";
// import { initStagehand } from "./initStagehand";
// import { EvalLogger } from "./logger";
// import { StagehandEvalError } from "@/types/stagehandErrors";
// import { CustomOpenAIClient } from "@/examples/external_clients/customOpenAI";
// import { AISdkClient } from "@/examples/external_clients/aisdk";
// import { getAISDKLanguageModel } from "@/lib/llm/LLMProvider";
// import { loadApiKeyFromEnv } from "@/lib/utils";
// import { AgentProvider } from "@/lib/agent/AgentProvider";
// import { wrapAISDKModel, wrapOpenAI } from "braintrust";
// import OpenAI from "openai";
// import { AvailableModel, LLMClient } from "@browserbasehq/stagehand";

// async function runTask() {
//   const { input, USE_API } = workerData;
//   const logger = new EvalLogger();

//   try {
//     // Import task module
//     const taskModulePath = path.join(__dirname, "tasks", `${input.name}.ts`);
//     let taskModule;

//     try {
//       taskModule = await import(taskModulePath);
//     } catch (error) {
//       if (input.name.includes("/")) {
//         const subDirPath = path.join(__dirname, "tasks", `${input.name}.ts`);
//         try {
//           taskModule = await import(subDirPath);
//         } catch (subError) {
//           throw new StagehandEvalError(
//             `Failed to import task module for ${input.name}`,
//           );
//         }
//       } else {
//         throw error;
//       }
//     }

//     const taskName = input.name.includes("/")
//       ? input.name.split("/").pop()
//       : input.name;

//     const taskFunction = taskModule[taskName];

//     if (typeof taskFunction !== "function") {
//       throw new StagehandEvalError(
//         `No Eval function found for task: ${taskName}`,
//       );
//     }

//     // Initialize Stagehand
//     let taskInput;

//     if (USE_API) {
//       let provider: string;
//       if (input.modelName.includes("/")) {
//         provider = input.modelName.split("/")[0];
//       } else {
//         try {
//           provider = AgentProvider.getAgentProvider(input.modelName);
//         } catch {
//           provider = undefined as unknown as string;
//         }
//       }

//       const apiKey = loadApiKeyFromEnv(provider, (line) => logger.log(line));

//       if (!apiKey) {
//         throw new StagehandEvalError(
//           `USE_API=true but no API key found for provider "${provider}".`,
//         );
//       }

//       taskInput = await initStagehand({
//         logger,
//         modelName: input.modelName,
//         modelClientOptions: { apiKey },
//       });
//     } else {
//       let llmClient: LLMClient;
//       if (input.modelName.includes("/")) {
//         llmClient = new AISdkClient({
//           model: wrapAISDKModel(
//             getAISDKLanguageModel(
//               input.modelName.split("/")[0],
//               input.modelName.split("/")[1],
//             ),
//           ),
//         });
//       } else {
//         llmClient = new CustomOpenAIClient({
//           modelName: input.modelName as AvailableModel,
//           client: wrapOpenAI(
//             new OpenAI({
//               apiKey: process.env.TOGETHER_AI_API_KEY,
//               baseURL: "https://api.together.xyz/v1",
//             }),
//           ),
//         });
//       }
//       taskInput = await initStagehand({
//         logger,
//         llmClient,
//         modelName: input.modelName,
//       });
//     }

//     // Run the task
//     let result;
//     try {
//       result = await taskFunction({ ...taskInput, input });
//     } finally {
//       await taskInput.stagehand.close();
//     }

//     parentPort?.postMessage({ success: true, result });
//   } catch (error) {
//     parentPort?.postMessage({
//       success: false,
//       error: {
//         message: error.message,
//         stack: error.stack,
//         logs: logger.getLogs(),
//       },
//     });
//   }
// }

// runTask();
