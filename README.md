# Mdsvex Draft Manager README

[![Test](https://github.com/BrMacCath/MdsvexDraftManager/actions/workflows/tests.yml/badge.svg)](https://github.com/BrMacCath/MdsvexDraftManager/actions/workflows/tests.yml)
[![codecov](https://codecov.io/gh/BrMacCath/MdsvexDraftManager/graph/badge.svg?token=RBFNGESDQ5)](https://codecov.io/gh/BrMacCath/MdsvexDraftManager)

## Purpose

The point of this app is to be able to make drafts in markdown files and then transfer over what you wish into a mdsvex file semi automatically. This combines the practicalilty of markdown with the forrmat of mdsvex for sveltekit applications.

# Features
Currently this app has two commands for people to use, update markdown and use mdsvex template.

## Update Markdown

This will take a draft you have written according to your settings, remove comments, reformat it and then form a complete version of that draft while setting up a new draft.

## Use mdsvex template

Create a template file for your mdsvex file with places to put in pieces of complete markdown file. This command will then take this template, fill in the sections and out the output in the same folder but the file will be +page.svx.

# Extension Settings

## Frontmatter Settings

### Draft Number

This tells the extension what number draft you are on. Default is draftNum.


### Complete Section

This denotes the section which the use mdsvex section will take. Its default is completeSection.


## Draft Settings

### Have Topic Frontmatter

For each paragraph that you are writing, you can have space to write comments or notes to yourself. This can be turned off.

### Topic frontmatter Separator

How the topic fronmatter is separated from the paragraph. Its default is *---*

### Paragraph Separator

How each paragraph is separated from each other during drafts. Default is +---+

### Have comments

Decides whether each line in the new draft will have comments.

### Comment line signifier

How a comment line starts. Default is * .

### Rewrite line signifier

Indicates the rewrite of a line. Default is > .

# Releases

## 1.0.0


