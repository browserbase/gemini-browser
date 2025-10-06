// /**
//  * Multi-process version of the evaluation runner using Worker Threads
//  * This provides true parallelism by running tasks in separate V8 isolates
//  */
// import { Worker } from "worker_threads";
// import path from "path";
// import process from "process";
// import os from "os";
// import {
//   DEFAULT_EVAL_CATEGORIES,
//   filterByCategory,
//   filterByEvalName,
// } from "./args";
// import { generateExperimentName } from "./utils";
// import { tasksByName, tasksConfig, getModelList } from "./taskConfig";
// import { Testcase } from "@/types/evals";
// import { env } from "./env";
// import dotenv from "dotenv";
// import { generateSummary } from "./core/summary";
// import { buildGAIATestcases } from "./suites/gaia";
// import { buildWebVoyagerTestcases } from "./suites/webvoyager";
// import { buildOnlineMind2WebTestcases } from "./suites/onlineMind2Web";

// dotenv.config();

// // Use CPU count for max workers, with override from env
// const MAX_WORKERS = process.env.EVAL_MAX_WORKERS
//   ? parseInt(process.env.EVAL_MAX_WORKERS, 10)
//   : os.cpus().length;

// const TRIAL_COUNT = process.env.EVAL_TRIAL_COUNT
//   ? parseInt(process.env.EVAL_TRIAL_COUNT, 10)
//   : 3;

// const USE_API: boolean = (process.env.USE_API ?? "").toLowerCase() === "true";

// console.log(`Running with ${MAX_WORKERS} worker processes`);

// function runTaskInWorker(testcase: Testcase): Promise<any> {
//   return new Promise((resolve, reject) => {
//     const worker = new Worker(path.join(__dirname, "worker.ts"), {
//       workerData: {
//         input: testcase.input,
//         USE_API,
//       },
//       // Use ts-node to run TypeScript directly in worker
//       execArgv: [...process.execArgv, "-r", "ts-node/register"],
//     });

//     worker.on("message", (msg) => {
//       if (msg.success) {
//         console.log(`✅ ${testcase.input.name}: Passed`);
//         resolve(msg.result);
//       } else {
//         console.log(`❌ ${testcase.input.name}: Failed`);
//         resolve({
//           _success: false,
//           error: msg.error,
//           logs: msg.error.logs || [],
//         });
//       }
//     });

//     worker.on("error", (error) => {
//       console.error(`❌ ${testcase.input.name}: Worker error - ${error}`);
//       reject(error);
//     });

//     worker.on("exit", (code) => {
//       if (code !== 0) {
//         reject(new Error(`Worker stopped with exit code ${code}`));
//       }
//     });
//   });
// }

// async function runWithWorkerPool(testcases: Testcase[]) {
//   const results: any[] = [];
//   const queue = [...testcases];
//   const activeWorkers = new Map<number, Promise<void>>();

//   // Process queue with limited concurrency
//   while (queue.length > 0 || activeWorkers.size > 0) {
//     // Start new workers up to the limit
//     while (activeWorkers.size < MAX_WORKERS && queue.length > 0) {
//       const testcase = queue.shift()!;
//       const workerId = Date.now() + Math.random();

//       const workerPromise = runTaskInWorker(testcase)
//         .then((result) => {
//           results.push({
//             input: testcase.input,
//             output: result,
//             name: testcase.input.name,
//             score: result._success ? 1 : 0,
//           });
//         })
//         .catch((error) => {
//           console.error(`Worker error for ${testcase.input.name}:`, error);
//           results.push({
//             input: testcase.input,
//             output: { _success: false, error: error.message },
//             name: testcase.input.name,
//             score: 0,
//           });
//         })
//         .finally(() => {
//           activeWorkers.delete(workerId);
//         });

//       activeWorkers.set(workerId, workerPromise);
//     }

//     // Wait for at least one worker to complete
//     if (activeWorkers.size > 0) {
//       await Promise.race(activeWorkers.values());
//     }
//   }

//   return results;
// }

// const generateFilteredTestcases = (): Testcase[] => {
//   let taskNamesToRun: string[];
//   let effectiveCategory: string | null = filterByCategory;

//   if (filterByEvalName) {
//     taskNamesToRun = [filterByEvalName];
//     const taskCategories = tasksByName[filterByEvalName]?.categories || [];
//     if (
//       taskCategories.length === 1 &&
//       (taskCategories[0] === "agent" ||
//         taskCategories[0] === "external_agent_benchmarks")
//     ) {
//       effectiveCategory = taskCategories[0];
//       console.log(
//         `Task ${filterByEvalName} is in ${taskCategories[0]} category, using agent models.`,
//       );
//     }
//   } else if (filterByCategory) {
//     taskNamesToRun = Object.keys(tasksByName).filter((name) =>
//       tasksByName[name].categories.includes(filterByCategory!),
//     );
//   } else {
//     taskNamesToRun = Object.keys(tasksByName).filter((name) =>
//       DEFAULT_EVAL_CATEGORIES.some((category) =>
//         tasksByName[name].categories.includes(category),
//       ),
//     );
//   }

//   const currentModels = getModelList(effectiveCategory);
//   console.log(
//     `Using models for this run (${effectiveCategory || "default"}):`,
//     currentModels,
//   );

//   const datasetFilter = process.env.EVAL_DATASET;
//   const isGAIATaskIncluded = taskNamesToRun.includes("agent/gaia");
//   const isWebVoyagerTaskIncluded = taskNamesToRun.includes("agent/webvoyager");
//   const isOnlineMind2WebTaskIncluded = taskNamesToRun.includes(
//     "agent/onlineMind2Web",
//   );

//   let allTestcases: Testcase[] = [];

//   if (isGAIATaskIncluded && (!datasetFilter || datasetFilter === "gaia")) {
//     taskNamesToRun = taskNamesToRun.filter((t) => t !== "agent/gaia");
//     allTestcases.push(...buildGAIATestcases(currentModels));
//   } else if (isGAIATaskIncluded && datasetFilter && datasetFilter !== "gaia") {
//     taskNamesToRun = taskNamesToRun.filter((t) => t !== "agent/gaia");
//   }

//   if (
//     isWebVoyagerTaskIncluded &&
//     (!datasetFilter || datasetFilter === "webvoyager")
//   ) {
//     taskNamesToRun = taskNamesToRun.filter((t) => t !== "agent/webvoyager");
//     allTestcases.push(...buildWebVoyagerTestcases(currentModels));
//   } else if (
//     isWebVoyagerTaskIncluded &&
//     datasetFilter &&
//     datasetFilter !== "webvoyager"
//   ) {
//     taskNamesToRun = taskNamesToRun.filter((t) => t !== "agent/webvoyager");
//   }

//   if (
//     isOnlineMind2WebTaskIncluded &&
//     (!datasetFilter || datasetFilter === "onlinemind2web")
//   ) {
//     taskNamesToRun = taskNamesToRun.filter((t) => t !== "agent/onlineMind2Web");
//     allTestcases.push(...buildOnlineMind2WebTestcases(currentModels));
//   } else if (
//     isOnlineMind2WebTaskIncluded &&
//     datasetFilter &&
//     datasetFilter !== "onlinemind2web"
//   ) {
//     taskNamesToRun = taskNamesToRun.filter((t) => t !== "agent/onlineMind2Web");
//   }

//   const regularTestcases = currentModels.flatMap((model) =>
//     taskNamesToRun.map((testName) => ({
//       input: { name: testName, modelName: model },
//       name: testName,
//       tags: [
//         model,
//         testName,
//         ...(tasksConfig.find((t) => t.name === testName)?.categories || []).map(
//           (x) => `category/${x}`,
//         ),
//       ],
//       metadata: {
//         model: model,
//         test: testName,
//       },
//       expected: true,
//     })),
//   );

//   allTestcases = [...allTestcases, ...regularTestcases];

//   if (filterByCategory) {
//     allTestcases = allTestcases.filter((testcase) =>
//       tasksByName[testcase.name].categories.includes(filterByCategory!),
//     );
//   }

//   if (env === "BROWSERBASE") {
//     allTestcases = allTestcases.filter(
//       (testcase) => !["peeler_simple", "stock_x"].includes(testcase.name),
//     );
//   }

//   console.log(
//     "Final test cases to run:",
//     allTestcases
//       .map(
//         (t, i) =>
//           `${i}: ${t.name} (${t.input.modelName}): ${tasksByName[t.name].categories}`,
//       )
//       .join("\n"),
//   );

//   return allTestcases;
// };

// (async () => {
//   const experimentName: string = generateExperimentName({
//     evalName: filterByEvalName || undefined,
//     category: filterByCategory || undefined,
//     environment: env,
//   });

//   try {
//     const testcases = generateFilteredTestcases();

//     // Handle trials by duplicating testcases
//     const testcasesWithTrials = [];
//     for (let trial = 0; trial < TRIAL_COUNT; trial++) {
//       testcasesWithTrials.push(...testcases);
//     }

//     console.log(
//       `Running ${testcasesWithTrials.length} total test cases (${testcases.length} unique × ${TRIAL_COUNT} trials)`,
//     );

//     const results = await runWithWorkerPool(testcasesWithTrials);

//     await generateSummary(results, experimentName);

//     console.log("Evaluation complete!");
//   } catch (error) {
//     console.error("Error during evaluation run:", error);
//     process.exit(1);
//   }
// })();
