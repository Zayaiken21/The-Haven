# The Haven

The Haven is a browser-local, deterministic coding workshop.

## Important engineering truth

The Haven is **not an AI**. It does not reason like a large language model and it cannot honestly guarantee that arbitrary programs are 100% correct. Instead, it can become highly reliable by using:

- deterministic templates
- language grammars and parsers
- formatters
- linters
- compilers/interpreters
- test generation and execution
- project manifests
- dependency rules
- file/folder schemas
- reproducible builds

This first version is intentionally small and GitHub Pages compatible.

## Run

Upload the contents of this folder to a GitHub repository and enable GitHub Pages for the repository.

Open `index.html`.

No API key is required and no AI service is called.

## What this version does

- Builds deterministic starter projects
- Supports Web, HTML games, Node.js, Python and static projects
- Creates a project file tree
- Lets you edit generated files
- Performs basic validation
- Speaks status messages using the browser's Speech Synthesis API
- Downloads the project as a ZIP without an external ZIP library

## Roadmap to a serious "all-language" Haven

A true universal coding system needs a language registry, parser/compiler adapters, test runner, project graph, package/dependency resolver, sandbox, build cache and extensive test suites.

Those pieces should be added incrementally rather than pretending a static webpage can compile every language inside a browser.
