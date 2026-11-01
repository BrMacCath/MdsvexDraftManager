import * as vscode from "vscode";
import { frontMatterIndicator } from "../../constants/frontMatterConstants";
//What should this do?
// Add onto the draft in two ways.
// First it should have a completed draft added onto the end of the draft.
// Second it should add onto the 
// Return [frontmatter,content]
export function createFromFirstDraft(draft:string){
    // config settings
    const config = vscode.workspace.getConfiguration('myExtension');
    const paragraphSeparator = config.get<string>("draftStyle.paragraphSeparator", '+---+');
    const topicFrontMatterSeparator = config.get<string>("draftStyle.topicFrontmatterSeparator","*---*");
    const haveTopicFrontMatter = config.get<boolean>("draftStyle.haveTopicFrontmatterSeparator",true);
    const rewriteLineSignifier = config.get<string>("draftStyle.rewriteLineSignifier",">");
    const haveCommentLine = config.get<boolean>("draftStyle.haveLineComments",true);
    const commentLineSignifier =  config.get<string>("draftStyle.commentSignifier");
    const firstParagraphSeparator = "\n";
    const newLineSeperator = haveCommentLine? 
            "\n"+commentLineSignifier + " \n" + rewriteLineSignifier +" \n\n"
            :"\n"+ rewriteLineSignifier +" \n\n";
    
    // Remove frontmatter
    if(draft.slice(0,3) === frontMatterIndicator){
        draft = draft.slice(3);
        const frontmatterIndex = draft.indexOf(frontMatterIndicator);
        draft = draft.slice(frontmatterIndex + frontMatterIndicator.length);
    }
    // Remove the first Heading.
    const firstTitle        = "# First Draft";
    const firstTitleIndex   = draft.indexOf(firstTitle) + firstTitle.length;
    const tempDraft         = draft.slice(firstTitleIndex);
    let paragraphs          = tempDraft
                .split(firstParagraphSeparator).filter((t)=> {return t.trim() !=="";});
    let splitParagraph: [string,string[]][] = [];
    paragraphs.forEach((paragraph) =>{
        const paraContent = paragraph.split(".");
        splitParagraph.push(["",paraContent]);
    } );


    // Complete Draft
    let completeDraft:string[] = [];
    let newDraft:string[] = [];
    splitParagraph.forEach( (content)=>{
        const sentences = content[1].filter((t) =>{
            return t.trim()!=="";
        } );
        completeDraft.push(sentences.join(".") +"."); 
    }  );

    // Make new draft based on the topic front matter.
    if(!haveTopicFrontMatter){
        splitParagraph.forEach((content)=>{
            const sentences = content[1].filter((t) =>{return t.trim()!=="";});
            newDraft.push("\n" + sentences.join(newLineSeperator)+newLineSeperator );
        });
    }
    else{
        splitParagraph.forEach((content)=>{
            const topicFrontMatter = content[0];
            const sentences = content[1].filter((t) =>{
                return t.trim()!=="";
             });
            newDraft.push("\n"+topicFrontMatter+ "\n" + topicFrontMatterSeparator+ "\n" +sentences.join(newLineSeperator)+newLineSeperator );
        });
    }
    // New Draft
    let newContent = "";
    newContent += "\n\n## Complete First Draft\n\n" + completeDraft.join("\n\n")+"\n\n";
    newContent += "# Second Draft\n\n"+ paragraphSeparator + newDraft.join(paragraphSeparator);
    draft += newContent;
    return draft;
}