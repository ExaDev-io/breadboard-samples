/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Board, Schema } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import { TemplateKit } from "@google-labs/template-kit"
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";

const board = new Board({
  title: "The Critic",
  description: "Test Breadboard Kit",
  version: "0.0.1",
});

const coreKit = board.addKit(Core);
const claudeKit = board.addKit(ClaudeKit);

const criticOutput = board.output();

const inputCritic = board.input({
  $id: "critic-name",
  schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Critic Name",
        description: "The name of the Critic"
      },
	  id: {
        type: "string",
        title: "id",
        description: "The id of the critique being created",
      },
      article: {
        type: "string",
        title: "articleToCritique",
        description: "The article that is being critiqued",
      },
      persona: {
        type: "string",
        title: "Critic Persona",
        description: "The Persona of the Critic",
      }
    }
  } satisfies Schema
});

// const secret = starterKit.secrets({keys: ["CLAUDE_API_KEY"]});
const secret = coreKit.secrets({
	CLAUDE_API_KEY: "CLAUDE_API_KEY"
});

const templateKit = board.addKit(TemplateKit);

const criticPrompt = templateKit.promptTemplate({
	template: `
Your name is {{name}} and you are a {{persona}}.

You will create a markdown bulleted critique of the following input:

{{article}}

Critique:
`
});

const claudeCompletion = claudeKit.generateCompletion({ model: "claude-2.1", baseURL: globalThis.location?.origin || "http://localhost:5173" });

inputCritic.wire("persona->persona", criticPrompt);
inputCritic.wire("article->article", criticPrompt);
inputCritic.wire("name->name", criticPrompt);

criticPrompt.wire("prompt->text", claudeCompletion);
secret.wire("CLAUDE_API_KEY->CLAUDE_API_KEY", claudeCompletion);

claudeCompletion.wire("completion->response", criticOutput);
inputCritic.wire("name->name", criticOutput);
inputCritic.wire("id->id", criticOutput);

export default board;
