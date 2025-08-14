# Code Agent

## Purpose

Code Agent is an AI-powered assistant designed to help you interact with your codebase, automate tasks, and answer programming-related questions. It leverages OpenAI models to provide intelligent responses and can persist memory across sessions.

---

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) installed
- Node.js (compatible version)
- **Environment setup:**  
  Create a `.env` file in the project root with your OpenAI API key:
  ```
  OPENAI_API_KEY=your_openai_api_key_here
  ```
  Optionally set:
  - `DEBUG=true` — Enables debug output (prints agent steps).
  - `OPENAI_MODEL=model_name` — Choose a specific OpenAI model (default: `gpt-4.1`).

### Installation

```bash
pnpm install
```

### Building

```bash
pnpm build
```

### Running the Agent

```bash
pnpm chat
```

or

```bash
node dist/src/index.js
```

### Clearing Persistent Memory

```bash
pnpm clear-memory
```

or 

```bash
node dist/src/index.js clear
```
---

## Agent Tools

The agent is equipped with several tools to assist you. It will decide what tools it needs to use on its own to accomplish each task you ask of it. Below are the available tools, their descriptions, and example prompts that would nudge the agent to use the specific tool.

### 1. **readFileTool**

**Description:** Reads the contents of a file.

**Example Prompt:**
> Show me what's inside src/index.ts

---

### 2. **editFileTool**

**Description:** Edits files by replacing code/text.

**Example Prompt:**
> Edit my index.ts file to include more console.log statements

---

### 3. **writeFileTool**

**Description:** Writes content to a new or empty file.

**Example Prompt:**
> Create a new file called hello.txt with the text "Hello World!"

---

### 4. **checkCodeTool**

**Description:** Checks new code against quality measures and returns improved code if the new code is not acceptable. This is run by the agent before editing or writing to any files.

**Example Prompt:**
> Fix the key value error in my agent.ts file. 

---

### 5. **listFilesTool**

**Description:** Lists all files and directories inside a given directory.

**Example Prompt:**
> List all files in the src directory

---

### 6. **searchFileTool**

**Description:** Searches for a file by file name or by content. Returns the path to the first matching file.

**Example Prompt:**
> Find the file that contains the word "authentication"

---

### 7. **readImageTextTool**

**Description:** Reads and returns text off an image.

**Example Prompt:**
> The picture requirements.png up one directory has requirements that this repo should match. Can you please read the requirements in the picture and then read all of the code in this directory to see if I have met them all? If I haven't please suggest ways I can improve.

---

### 8. **runBashCommandTool**

**Description:** Executes a bash command and returns the stdout.

**Example Prompt:**
> Run "ls -la" in the project root

---

## Example Workflow

1. Start the agent: `pnpm chat`
2. Ask a question or request a code change.
3. Review the agent's response and follow its suggestions.
4. To clear memory: `pnpm clear-memory`

---
