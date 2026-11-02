import * as assert from "assert";
import { splitContent } from "../functions/drafts/splitContent";

suite('Split content tests',()=>{
    test('See that split Content on a file without frontmatter returns [\"\",\"\"]',()=>{
        const fileContent = String.raw`Here there is no frontmatter
        # First Draft
        Here we are`;
        const emptyFrontmatter = splitContent(fileContent);
        assert.deepStrictEqual(emptyFrontmatter, ["",""]);
    });

    test('See that split Content on a file without frontmatter ending returns [\"\",\"\"]',()=>{
        const fileContent = String.raw`---Here there is no frontmatter
        # First Draft
        Here we are`;
        const emptyFrontmatter = splitContent(fileContent);
        assert.deepStrictEqual(emptyFrontmatter, ["",""]);
    });

});