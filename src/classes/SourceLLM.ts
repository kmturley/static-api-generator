import { pipeline } from '@huggingface/transformers';
import { SourceConfig } from '../types/Source.js';
import { logger } from '../utils/Logger.js';
import Source from './Source.js';

export interface SourceLLMConfig extends SourceConfig {
  prompt: string;
  model: string;
}

export default class SourceLLM extends Source {
  private prompt: string;
  private model: string;

  constructor(config: SourceLLMConfig) {
    super(config);
    this.prompt = config.prompt;
    this.model = config.model;
  }

  async sync() {
    logger.info(`  🤖 ${this.model}`);
    const generator = await pipeline('text-generation', this.model);
    const result = await generator(this.prompt, {
      max_new_tokens: 512,
      do_sample: false,
    });
    const output = result as any;
    const generatedText = Array.isArray(output)
      ? output[0].generated_text
      : output.generated_text;
    this.import(generatedText);
  }
}
