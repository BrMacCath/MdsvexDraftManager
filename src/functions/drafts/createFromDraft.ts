import { frontMatterIndicator } from "../../constants/frontMatterConstants";
import { splitParagraphsFrontMatter } from "../paragraphs/splitParagraphsFrontMatter";
import { splitParagraphsNoFrontMatter } from "../paragraphs/splitParagraphsNoFrontMatter";
import { stringifyNumber } from "./stringifyNumber";
import * as vscode from 'vscode';


export function createFromDraft(draft:string,draftNum:number){
    const config = vscode.workspace.getConfiguration('myExtension');
    const paragraphSeparator = config.get<string>("draftStyle.paragraphSeparator", '+---+');
    const topicFrontMatterSeparator = config.get<string>("draftStyle.topicFrontmatterSeparator","*---*");
    const haveTopicFrontMatter = config.get<boolean>("draftStyle.haveTopicFrontmatterSeparator",true);
    const rewriteLineSignifier = config.get<string>("draftStyle.rewriteLineSignifier",">");
    const commentLineSignifier =  config.get<string>("draftStyle.commentSignifier");
    const haveCommentLine = config.get<boolean>("draftStyle.haveLineComments",true);
    const newLineSeperator = haveCommentLine? 
            "\n"+commentLineSignifier + " \n" + rewriteLineSignifier +" \n\n"
            :"\n"+ rewriteLineSignifier +" \n\n";

    // Remove frontmatter
    if(draft.slice(0,3) === frontMatterIndicator){
        draft = draft.slice(3);
        const frontmatterIndex = draft.indexOf(frontMatterIndicator);
        draft = draft.slice(frontmatterIndex + frontMatterIndicator.length);
    }
    
    // Select the content from the current draft.
    const currentDraftTitle = "# " + stringifyNumber(draftNum) +" Draft";
    const contentIndex = draft.indexOf(currentDraftTitle) + currentDraftTitle.length;
    const contentDraft = draft.slice(contentIndex);
    let paragraphs = contentDraft.split(paragraphSeparator).filter(t=>{return t.trim() !== "";});
    let splitParagraph: [string,string[]][] = [];

    if(!haveTopicFrontMatter){
        splitParagraph =splitParagraphsNoFrontMatter(paragraphs,rewriteLineSignifier);
    }
    else
    {   
        splitParagraph = splitParagraphsFrontMatter(paragraphs);
    }
    // Complete Draft
    let completeDraft:string[] = [];
    let newDraft:string[] = [];
    splitParagraph.forEach( (content)=>{
        const sentences = content[1].map(t =>t.replace(".",""));
        completeDraft.push(sentences.join(". ") +".");
    }  );

    // Make new draft based on the topic front matter.
    if(!haveTopicFrontMatter){
        splitParagraph.forEach((content)=>{
            const sentences = content[1].map(t => t.replace(".",""));
            newDraft.push("\n"+sentences.join(newLineSeperator)+newLineSeperator );
        });
    }
    else{
        splitParagraph.forEach((content)=>{
            const topicFrontMatter = content[0].trim();
            const sentences = content[1].map(t =>{
            return t.replace(".","");
        });
            newDraft.push(topicFrontMatter+"\n\n"+ topicFrontMatterSeparator+ "\n" +sentences.join(newLineSeperator)+newLineSeperator );
        });
    }
    // New Draft
    let newContent = "";
    newContent += `\n\n## Complete ${stringifyNumber(draftNum)} Draft\n\n` + completeDraft.join("\n\n")+"\n\n";
    newContent += `# ${stringifyNumber(draftNum+1)} Draft\n\n` + newDraft.join(paragraphSeparator +"\n");
    return draft + newContent;
}
