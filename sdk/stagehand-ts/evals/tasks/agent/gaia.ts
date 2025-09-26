import { EvalFunction } from "@/types/evals";
import { Evaluator } from "../../evaluator";

/**
 * Data-driven GAIA agent eval
 * - Expects per-test params injected via eval runner: { id, level, web, ques }
 * - Starts at `web`, runs the agent with `ques` as instruction
 * - Requires the agent to output a final answer in the form: "Final Answer: <value>"
 * - Marks success if such an answer string is present (exact matching against dataset can be layered later)
 */
export const gaia: EvalFunction = async ({
  stagehand,
  logger,
  debugUrl,
  sessionUrl,
  modelName,
  input,
}) => {
  const startTime = Date.now();

  try {
    const params = ((input && input.params) || {}) as {
      id?: string;
      level?: number;
      web?: string;
      ques?: string;
    };

    if (!params.web || !params.ques) {
      logger.error({
        category: "gaia",
        level: 0,
        message: `Missing GAIA params (web, ques).`,
        auxiliary: {
          params: { value: JSON.stringify(params), type: "object" },
        },
      });
      return {
        _success: false,
        error: `Missing GAIA params (web, ques). Got: ${JSON.stringify(params)}`,
        execution_time: Date.now() - startTime,
        debugUrl,
        sessionUrl,
        logs: logger.getLogs(),
      };
    }
    await stagehand.page.goto(params.web);

    const agent = stagehand.agent({
      model: modelName,
      provider: modelName.startsWith("claude") ? "anthropic" : "openai",
      instructions: `You are a helpful assistant that must solve the task by browsing. You must produce a single line at the end like: "Final Answer: <answer>". Do not ask follow up questions. Current page: ${await stagehand.page.title()}`,
    });

    const maxSteps = Number(process.env.AGENT_EVAL_MAX_STEPS) || 50;
    const result = await agent.execute({
      instruction: params.ques,
      maxSteps: maxSteps,
    });
    logger.log(result);

    const expected = (params as Record<string, unknown>).expected as
      | string
      | undefined;
    const evaluator = new Evaluator(stagehand);

    let evalResult;
    try {
      evalResult = await evaluator.ask({
        question: `Did the agent provide the expected answer: "${expected}"?`,
        answer: result?.message || "",
        screenshot: false,
      });
    } catch (evalError) {
      logger.error({
        category: "gaia",
        level: 0,
        message: `Evaluator failed`,
        auxiliary: {
          error: {
            value:
              evalError instanceof Error
                ? evalError.message
                : String(evalError),
            type: "string",
          },
        },
      });
      throw evalError; // Let index.eval.ts handle error categorization
    }

    return {
      _success: evalResult.evaluation === "YES",
      reasoning: evalResult.reasoning,
      final_answer: result?.message,
      execution_time: Date.now() - startTime,
      debugUrl,
      sessionUrl,
      logs: logger.getLogs(),
    };
  } finally {
    stagehand.close();
  }
};
