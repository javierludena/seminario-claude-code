// Claude Code seminar deck — Boris Cherny style: black, monospace, lowercase, sparse
const pptxgen = require("pptxgenjs");

const BG = "0A0A0A";
const FG = "F5F1EA";      // warm off-white
const MUTED = "8C8578";   // warm gray
const ACCENT = "D97757";  // anthropic coral
const MONO = "Courier New";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.defineSlideMaster({ title: "DARK", background: { color: BG } });

const W = 13.33;

let slideNo = 0;
function baseSlide() {
  const s = pres.addSlide({ masterName: "DARK" });
  slideNo++;
  if (slideNo > 1) {
    s.addText(String(slideNo), {
      x: W - 1.0, y: 6.95, w: 0.6, h: 0.35, align: "right",
      fontFace: MONO, fontSize: 11, color: MUTED, margin: 0,
    });
  }
  return s;
}

// Standard slide: lowercase title + body lines
// lines: array of arrays of runs, or strings
function slide(title, lines, opts = {}) {
  const s = baseSlide();
  s.addText(title, {
    x: 0.9, y: 0.75, w: W - 1.8, h: 0.9,
    fontFace: MONO, fontSize: opts.titleSize || 30, bold: true,
    color: opts.titleColor || FG, margin: 0, align: "left",
  });
  const bodyRuns = [];
  lines.forEach((line) => {
    const arr = typeof line === "string" ? [{ t: line }] : line;
    arr.forEach((r, j) => {
      bodyRuns.push({
        text: r.t,
        options: {
          color: r.c || FG,
          bold: !!r.b,
          fontSize: r.s || opts.bodySize || 18,
          breakLine: j === arr.length - 1,
        },
      });
    });
  });
  s.addText(bodyRuns, {
    x: 0.9, y: opts.bodyY || 2.0, w: W - 1.8, h: 7.5 - (opts.bodyY || 2.0) - 0.7,
    fontFace: MONO, margin: 0, align: "left", valign: "top",
    lineSpacing: opts.lineSpacing || 34, paraSpaceAfter: opts.paraSpace || 10,
  });
  if (opts.notes) s.addNotes(opts.notes);
  return s;
}

const A = (t) => ({ t, c: ACCENT });        // accent run
const M = (t) => ({ t, c: MUTED });         // muted run
const F = (t, b) => ({ t, b });             // fg run

// ---------------------------------------------------------------- 1. cover
{
  const s = baseSlide();
  s.addText("follow along:", {
    x: 0.9, y: 2.2, w: W - 1.8, h: 0.8,
    fontFace: MONO, fontSize: 32, bold: true, color: FG, margin: 0,
  });
  s.addText([
    { text: "$ ", options: { color: MUTED, breakLine: false } },
    { text: "npm install -g @anthropic-ai/claude-code", options: { color: ACCENT } },
  ], {
    x: 0.9, y: 3.15, w: W - 1.8, h: 0.8,
    fontFace: MONO, fontSize: 24, margin: 0,
  });
  s.addText([
    { text: "claude code in practice", options: { color: FG, breakLine: true } },
    { text: "altia control tower · internal seminar", options: { color: MUTED } },
  ], {
    x: 0.9, y: 6.15, w: W - 1.8, h: 0.9,
    fontFace: MONO, fontSize: 14, margin: 0, lineSpacing: 22,
  });
  s.addNotes("While people settle in, have them install Claude Code. Requires Node 18+.");
}

// ------------------------------------------------- 2. new kind of assistant
slide("claude code is a new kind of ai assistant", [
  [M("1. "), F("terminal-based, not an ide")],
  [M("2. "), F("works with ai tools")],
  [M("3. "), F("fits into all existing workflows")],
  [M("4. "), F("general purpose — use it for almost anything")],
  [M("5. "), F("infinitely hackable")],
], {
  lineSpacing: 44, bodyY: 2.2, bodySize: 20,
  notes: "Not autocomplete: it reads your repo, edits files, runs commands, runs tests, makes commits. Recommended flow: Explore → Plan → Code → Commit.",
});

// ------------------------------------------------------- 3. first-time cmds
slide("useful things to try on day one", [
  [A("claude"), M("                start a session in any repo")],
  [A("/init"), M("                 generate a CLAUDE.md for your project")],
  [A("# remember this"), M("       add a note to memory (CLAUDE.md)")],
  [A("/clear"), M("                reset context between tasks")],
  [A("/help"), M("                  everything else")],
], {
  lineSpacing: 40, bodySize: 17,
  notes: "Live demo: run claude in a real repo, try /init.",
});

// ------------------------------------------------------------ 4. keybindings
slide("keybindings worth memorizing", [
  [A("shift+tab"), M("        cycle modes: auto-accept / plan")],
  [A("!"), M("                bash mode — run any shell command")],
  [A("@"), M("                add a file or folder to context")],
  [A("ctrl+r"), M("           search your prompt history")],
  [A("esc"), M("              cancel whatever claude is doing")],
  [A("esc esc"), M("          jump back to an earlier point")],
  [A("claude --resume"), M("  pick up a past session")],
], {
  titleSize: 28, lineSpacing: 38, bodySize: 17,
  notes: "Live demo: shift+tab into plan mode, @ a file, esc esc to rewind.",
});

// ----------------------------------------------------------------- 5. models
slide("pick your model", [
  [A("/model"), M("           switch models mid-session")],
  [F("")],
  [F("sonnet"), M("           fast + cheap — everyday work")],
  [F("opus"), M("             strongest — the hard problems")],
  [F("fable"), M("            a mythos model — use it with /advisor")],
  [F("")],
  [A("← →"), M("              inside /model: set reasoning effort")],
  [M("                 (low / medium / high)")],
], {
  lineSpacing: 36, bodySize: 18,
  notes: "Sonnet as the daily driver; switch to Opus (or raise effort) only when the problem deserves it.",
});

// -------------------------------------------------------------- 6. claude.md
slide("CLAUDE.md", [
  [F("the file claude code reads automatically on start")],
  [F("")],
  [F("give it the context that isn't in the code:")],
  [M("  conventions · how to run tests · what NOT to touch ·")],
  [M("  how you like it to work")],
], {
  lineSpacing: 38, bodySize: 19,
});

// ---------------------------------------------------------- 7. where it lives
slide("where CLAUDE.md lives", [
  [A("./CLAUDE.md"), M("           repo root — shared with the team")],
  [A("./module/CLAUDE.md"), M("    rules specific to that module")],
  [A("~/.claude/CLAUDE.md"), M("   personal — follows you everywhere")],
], {
  lineSpacing: 44, bodyY: 2.3, bodySize: 18,
});

// ------------------------------------------------------ 8. teach it to think
slide("a good CLAUDE.md teaches claude how to think", [
  [M("1. "), F("think before coding", true), M("      don't assume. surface confusion early")],
  [M("2. "), F("simplicity first", true), M("         simplest thing that works. no speculative features")],
  [M("3. "), F("surgical changes", true), M("         every touched line traces to the request")],
  [M("4. "), F("goal-driven execution", true), M("    vague asks → verifiable goals")],
  [F("")],
  [M("reference: github.com/multica-ai/andrej-karpathy-skills")],
], {
  titleSize: 26, lineSpacing: 38, bodySize: 16,
  notes: "Karpathy's CLAUDE.md: reasoning patterns, not rigid rules.",
});

// ---------------------------------------------------------------- 9. 150 lines
slide("keep it short", [
  [F("~150 lines max")],
  [F("")],
  [F("it's "), A("preferences"), F(", not documentation")],
  [M("a long CLAUDE.md reads worse — and competes for context")],
  [M("on every single prompt")],
], {
  lineSpacing: 40, bodyY: 2.2, bodySize: 19,
});

// --------------------------------------------------------------- 10. prompting
slide("a prompt is a work order, not a question", [
  [M("· "), F("give context, not just the task")],
  [M("· "), F("be specific about the expected result")],
  [M("· "), F("ask for a plan before code on big changes")],
  [M("· "), F("iterate — no need to be perfect on the first try")],
  [M("· "), F("give examples when output format matters")],
  [M("· "), A("add constraints — the best lever you have")],
  [M('    "keep the public api. no new deps. don\'t touch the css."')],
], {
  titleSize: 26, lineSpacing: 38, bodySize: 18,
});

// --------------------------------------------------------- 11. weak vs better
{
  const s = baseSlide();
  s.addText("weak prompt vs better prompt", {
    x: 0.9, y: 0.75, w: W - 1.8, h: 0.9,
    fontFace: MONO, fontSize: 30, bold: true, color: FG, margin: 0,
  });
  s.addText([
    { text: '"fix the login bug"', options: { color: MUTED } },
  ], {
    x: 0.9, y: 2.1, w: W - 1.8, h: 0.6, fontFace: MONO, fontSize: 18, margin: 0,
  });
  s.addText([
    { text: '"/login returns 500 when the email has uppercase.', options: { color: ACCENT, breakLine: true } },
    { text: ' check AuthController.login and add the case to the', options: { color: ACCENT, breakLine: true } },
    { text: ' existing tests."', options: { color: ACCENT } },
  ], {
    x: 0.9, y: 3.0, w: W - 1.8, h: 1.7, fontFace: MONO, fontSize: 18, margin: 0, lineSpacing: 30,
  });
  s.addText([
    { text: '"improve this component"', options: { color: MUTED } },
  ], {
    x: 0.9, y: 4.7, w: W - 1.8, h: 0.6, fontFace: MONO, fontSize: 18, margin: 0,
  });
  s.addText([
    { text: '"refactor UserTable.tsx to paginate client-side. keep', options: { color: ACCENT, breakLine: true } },
    { text: ' the public api. no new dependencies."', options: { color: ACCENT } },
  ], {
    x: 0.9, y: 5.6, w: W - 1.8, h: 1.2, fontFace: MONO, fontSize: 18, margin: 0, lineSpacing: 30,
  });
}

// ------------------------------------------------------------ 12. plan / act
slide("plan / act / auto", [
  [A("plan"), M("   read-only. explores, proposes a plan. you approve")],
  [M("       before it touches a single line")],
  [F("")],
  [A("act"), M("    executes — asks permission along the way")],
  [F("")],
  [A("auto"), M("   doesn't ask. decides and keeps going")],
  [M("       some commands stay blocked — e.g. "), A("git push")],
], {
  lineSpacing: 36, bodyY: 2.2, bodySize: 18,
  notes: "Live demo: ambiguous change in plan mode, show the plan before approving.",
});

// --------------------------------------------------------------- 13. workflow
slide("when to use which", [
  [F("big, ambiguous, multi-file"), M("   → plan first")],
  [F("small and clear"), M("              → act directly")],
  [F("")],
  [A("explore → plan → act → review")],
  [F("")],
  [M('look at the diff. "the ai did it" is not a review')],
], {
  lineSpacing: 38, bodyY: 2.2, bodySize: 19,
});

// -------------------------------------------------------------------- 14. mcp
slide("mcp: give claude your systems", [
  [F("a server that exposes "), A("tools + context"), F(" from external")],
  [F("systems — without leaving the terminal, without")],
  [F("copy-pasting data by hand")],
], {
  lineSpacing: 38, bodyY: 2.3, bodySize: 19,
});

// ----------------------------------------------------------------- 15. dedalo
slide("case: mcp-dedalo", [
  [A("claude code → mcp-dedalo → redmine api → dédalo")],
  [F("")],
  [F("time tracking and tasks, from your terminal")],
  [F("")],
  [M("requires node 22+ · auth is automatic via altia sso")],
  [M("no tokens, no env vars")],
], {
  lineSpacing: 36, bodySize: 18,
  notes: "Internal repo: mcp-dedalo (garage.altia.es, Laboratory/mycopilot-resources). Support: ServiceDesk TI → Gestor MyAssistant.",
});

// ------------------------------------------------------------------ 16. setup
{
  const s = baseSlide();
  s.addText("one command to set it up", {
    x: 0.9, y: 0.75, w: W - 1.8, h: 0.9,
    fontFace: MONO, fontSize: 30, bold: true, color: FG, margin: 0,
  });
  s.addText([
    { text: "$ ", options: { color: MUTED, breakLine: false } },
    { text: "claude mcp add --transport http mcpdedalo \\", options: { color: ACCENT, breakLine: true } },
    { text: "    https://mcpproxy.altia.es/metamcp/dedalo/mcp", options: { color: ACCENT } },
  ], {
    x: 0.9, y: 2.5, w: W - 1.8, h: 1.4, fontFace: MONO, fontSize: 19, margin: 0, lineSpacing: 32,
  });
  s.addText("first use opens the browser for altia sso login", {
    x: 0.9, y: 4.5, w: W - 1.8, h: 0.5, fontFace: MONO, fontSize: 16, color: MUTED, margin: 0,
  });
}

// --------------------------------------------------------------- 17. examples
slide("then just talk to it", [
  [A('"what are my pending tasks in dédalo?"')],
  [A('"log 3 hours of development on task 123456"')],
  [A('"mark task 123456 as resolved, set it to 100%"')],
  [A('"comment on 123456: blocked waiting for test env access"')],
  [F("")],
  [M("20 tools: list issues, log time, update status, create tasks…")],
], {
  lineSpacing: 40, bodySize: 17,
  notes: "Live demo: list my tasks and log hours on a real task from Claude Code.",
});

// ------------------------------------------------------------------ 18. tricks
slide("three tricks most people don't use", [
  [M("1. "), A("/compact"), M("   compress the conversation into a summary —")],
  [M("               keep working without starting over")],
  [M("2. "), A("/cost /context"), M("   session cost + how full your context is —")],
  [M("               know when to start fresh")],
  [M("3. "), A("/advisor"), M("   second opinion from a stronger model (opus)")],
  [M("               at the moments that matter — cheap if used well")],
], {
  titleSize: 26, lineSpacing: 36, bodySize: 17,
});

// ------------------------------------------------------------------ 19. agents
slide("agents: delegate without burning context", [
  [F("claude can spawn "), A("subagents"), F(" to handle a task")],
  [F("")],
  [F("each one works in its "), A("own context window")],
  [F("your context stays clean — "), A("only the result comes back")],
  [F("")],
  [M("great for: exploring big codebases · parallel work · reviews")],
], {
  titleSize: 26, lineSpacing: 38, bodyY: 2.2, bodySize: 18,
  notes: "Example: ask an agent to search the whole repo — it reads dozens of files in its own context and returns just the answer.",
});

// ------------------------------------------------------------- 19b. launch them
slide("how to launch them: just ask", [
  [A('"use a subagent to find every place we validate emails"')],
  [A('"launch 3 agents in parallel, one per module"')],
  [A('"have an agent review this diff before we commit"')],
  [F("")],
  [F("/agents"), M("   define custom specialists (reviewer, tester…)")],
  [M("          stored in .claude/agents — shared with the team")],
], {
  titleSize: 28, lineSpacing: 38, bodySize: 17,
  notes: "No special syntax needed — plain language. /agents opens the manager to create reusable specialized agents with their own prompt and tools.",
});

// ------------------------------------------------------------------ 19. design
slide("claude design → claude code", [
  [F("design the ux/ui in claude design (web)")],
  [F("bring it back into claude code")],
  [F("implement it directly on the project")],
  [F("")],
  [A("design → code, without rewriting markup by hand")],
], {
  lineSpacing: 38, bodyY: 2.3, bodySize: 19,
});

// ------------------------------------------------------- 19c. style guide
{
  const s2 = baseSlide();
  s2.addText("first: extract your project's style guide", {
    x: 0.9, y: 0.75, w: W - 1.8, h: 0.9,
    fontFace: MONO, fontSize: 28, bold: true, color: FG, margin: 0,
  });
  s2.addText([
    { text: "$ ", options: { color: MUTED, breakLine: false } },
    { text: "claude", options: { color: FG } },
  ], {
    x: 0.9, y: 2.1, w: W - 1.8, h: 0.5, fontFace: MONO, fontSize: 18, margin: 0,
  });
  s2.addText([
    { text: '"analyze this project\'s ui and write a style-guide.md:', options: { color: ACCENT, breakLine: true } },
    { text: ' colors, typography, spacing, component patterns,', options: { color: ACCENT, breakLine: true } },
    { text: ' naming conventions. single self-contained file."', options: { color: ACCENT } },
  ], {
    x: 0.9, y: 2.8, w: W - 1.8, h: 1.6, fontFace: MONO, fontSize: 18, margin: 0, lineSpacing: 32,
  });
  s2.addText([
    { text: "upload it to claude.ai/design →", options: { color: FG, breakLine: true } },
    { text: "every design it generates matches your product", options: { color: MUTED } },
  ], {
    x: 0.9, y: 5.1, w: W - 1.8, h: 1.0, fontFace: MONO, fontSize: 16, margin: 0, lineSpacing: 28,
  });
  s2.addNotes("Run this once per project. The style guide travels to Claude Design so mockups come back already on-brand, then back into Claude Code to implement.");
}

// -------------------------------------------------------------- 20. learn more
slide("learn more", [
  [A("anthropic.skilljar.com"), M("   free official courses, certificate")],
  [F("")],
  [M("· "), F("claude code 101")],
  [M("· "), F("claude code in action")],
  [M("· "), F("introduction to subagents")],
  [M("· "), F("introduction to agent skills")],
], {
  lineSpacing: 36, bodySize: 18,
});

// ---------------------------------------------------------------- 21. closing
slide("takeaways", [
  [M("1. "), F("claude code doesn't replace your judgment — review the diff")],
  [M("2. "), F("start with a good CLAUDE.md and prompts with real context")],
  [M("3. "), F("plan mode for the ambiguous, act for the clear")],
  [M("4. "), F("mcp-dedalo is live — "), A("try it this week")],
], {
  lineSpacing: 42, bodyY: 2.2, bodySize: 18,
});

// ---------------------------------------------------------------- 22. questions
{
  const s = baseSlide();
  s.addText("questions?", {
    x: 0.9, y: 3.0, w: W - 1.8, h: 1.0, fontFace: MONO, fontSize: 40,
    bold: true, color: FG, margin: 0,
  });
  s.addText([
    { text: "$ ", options: { color: MUTED, breakLine: false } },
    { text: "claude", options: { color: ACCENT, breakLine: false } },
    { text: " █", options: { color: FG } },
  ], {
    x: 0.9, y: 4.2, w: W - 1.8, h: 0.6, fontFace: MONO, fontSize: 20, margin: 0,
  });
}

pres.writeFile({ fileName: "claude-code-seminar.pptx" }).then(() => console.log("done"));
