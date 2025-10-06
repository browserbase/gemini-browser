/**
 * This example shows how to use a computer use agent (CUA) to navigate a web page and extract data.
 *
 * To learn more about the CUA, see: https://docs.stagehand.dev/examples/computer_use
 *
 * NOTE: YOU MUST CONFIGURE BROWSER DIMENSIONS TO USE COMPUTER USE!
 * Check out stagehand.config.ts for more information.
 */
import { Stagehand } from "@browserbasehq/stagehand";
import StagehandConfig from "@/stagehand.config";
import chalk from "chalk";
import fs from "fs";

async function main() {
  console.log(
    `\n${chalk.bold("Stagehand 🤘 Computer Use Agent (CUA) Demo")}\n`,
  );

  // Initialize Stagehand
  const stagehand = new Stagehand({
    ...StagehandConfig,
    env: "LOCAL",
    verbose: 2, // 0: silent, 1: info, 2: debug
    useAPI: false,
  });
  await stagehand.init();

  try {
    const page = stagehand.page;
    // Create a computer use agent
    const agent = stagehand.agent({
      provider: "google",
      // For Anthropic, use claude-sonnet-4-20250514 or claude-3-7-sonnet-latest
      // For OpenAI use computer-use-preview
      model: "computer-use-preview-10-2025",
      // model: "claude-sonnet-4-5-20250929",
      instructions: `You are a helpful assistant that can use a web browser.
      You are currently on the following page: ${page.url()}.
      Do not ask follow up questions, the user will trust your judgement.`,
      options: {
        apiKey: process.env.GEMINI_API_KEY,
      },
    });

    // Navigate to the Browserbase careers page
    await page.goto("https://www.amazon.com");
    fs.writeFileSync("screenshot.png", await page.screenshot());

    // Define the instruction for the CUA
    // const instruction =
    //   "Apply for the first engineer position with mock data. Don't submit the form.";
    // console.log(`Instruction: ${chalk.white(instruction)}`);
    // const client = await stagehand.context.newCDPSession(page);
    // Draw a cursor on the page so we can see where it clicks
    // await page.evaluate(() => {
    //   // Remove any existing cursor
    //   const existingCursor = document.getElementById('stagehand-cursor');
    //   if (existingCursor) {
    //     existingCursor.remove();
    //   }

    //   // Create cursor element
    //   const cursor = document.createElement('div');
    //   cursor.id = 'stagehand-cursor';
    //   cursor.style.cssText = `
    //     position: fixed;
    //     width: 14px;
    //     height: 14px;
    //     background: red;
    //     border: 2px solid white;
    //     border-radius: 50%;
    //     pointer-events: none;
    //     z-index: 999999;
    //     transform: translate(-50%, -50%);
    //     box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    //   `;
    //   document.body.appendChild(cursor);

    //   // Track mouse movements and update cursor position
    //   document.addEventListener('mousemove', (e) => {
    //     cursor.style.left = e.clientX + 'px';
    //     cursor.style.top = e.clientY + 'px';
    //   });

    //   // Add click animation
    //   document.addEventListener('mousedown', () => {
    //     cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    //     cursor.style.background = 'darkred';
    //   });

    //   document.addEventListener('mouseup', () => {
    //     cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    //     cursor.style.background = 'red';
    //   });
    // });

    // await client.send("Input.dispatchMouseEvent", {
    //   type: "mouseMoved",
    //   x: 220,
    //   y: 360,
    //   button: "none",
    // });
    // await client.send("Input.dispatchMouseEvent", {
    //   type: "mousePressed",
    //   x: 220,
    //   y: 360,
    //   button: "left",
    // });
    // await page.keyboard.type("New York City");
    const instruction =
      "Find climbing gears and sort the results by price high to low. Answer the first 3 results after sorting";

    // Execute the instruction
    const result = await agent.execute({
      instruction,
      maxSteps: 20,
      autoScreenshot: false,
    });

    console.log(`${chalk.green("✓")} Execution complete`);
    console.log(`${chalk.yellow("⤷")} Result:`);
    console.log(chalk.white(JSON.stringify(result, null, 2)));
  } catch (error) {
    console.log(`${chalk.red("✗")} Error: ${error}`);
    if (error instanceof Error && error.stack) {
      console.log(chalk.dim(error.stack.split("\n").slice(1).join("\n")));
    }
  } finally {
    // Close the browser
    await stagehand.close();
  }
}

main().catch((error) => {
  console.log(`${chalk.red("✗")} Unhandled error in main function`);
  console.log(chalk.red(error));
});
