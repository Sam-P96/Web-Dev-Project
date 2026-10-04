import { runTool } from "../services/chatTools.js";
import { search } from "../services/retriever.js";

vi.mock("../services/retriever.js");

beforeEach(() => {
  search.mockReset();
});

describe("runTool", () => {
  it("search_knowledge_base returns the chunk texts to the LLM and the sections as sources", async () => {
    search.mockResolvedValue([{ section: "Fees", question: "Is it free?", text: "Fees > Is it free?\nYes.", score: 0.8 }]);

    const result = await runTool("search_knowledge_base", { query: "  is it free  " });

    expect(search).toHaveBeenCalledWith("is it free");
    expect(result).toEqual({ output: { results: ["Fees > Is it free?\nYes."] }, sources: ["Fees"] });
  });

  it("caps very long queries", async () => {
    search.mockResolvedValue([]);
    await runTool("search_knowledge_base", { query: "a".repeat(2000) });
    expect(search.mock.calls[0][0]).toHaveLength(500);
  });

  it("tells the LLM when nothing was found", async () => {
    search.mockResolvedValue([]);
    const result = await runTool("search_knowledge_base", { query: "pizza" });
    expect(result.output.results).toEqual([]);
    expect(result.sources).toEqual([]);
  });

  it.each([{}, { query: "" }, { query: 42 }])("returns an error (no search, no throw) for bad args %j", async (args) => {
    const result = await runTool("search_knowledge_base", args);
    expect(result.output.error).toEqual(expect.any(String));
    expect(search).not.toHaveBeenCalled();
  });

  it("returns an error for an unknown tool", async () => {
    const result = await runTool("delete_everything", {});
    expect(result.output.error).toMatch(/Unknown tool/);
  });
});
