import { describe, it, expect, vi } from 'vitest';
import SourceLLM from '../../src/classes/SourceLLM.js';
import { SourceFormat } from '../../src/types/Source.js';

// Mock the transformers library
vi.mock('@huggingface/transformers', () => ({
  pipeline: vi.fn(() =>
    Promise.resolve(
      vi.fn(() =>
        Promise.resolve([
          {
            generated_text:
              '{"title": "Test Book", "author": "Test Author", "description": "A test book"}',
          },
        ]),
      ),
    ),
  ),
}));

describe('SourceLLM', () => {
  it('should create instance with correct config', () => {
    const config = {
      format: SourceFormat.Llm,
      paths: [],
      prompt: 'Generate a book',
      model: 'test-model',
      mapper: (source: any) => [
        {
          orgId: 'test-org',
          pkgId: 'test-pkg',
          data: source,
        },
      ],
    };

    const sourceLLM = new SourceLLM(config);
    expect(sourceLLM).toBeInstanceOf(SourceLLM);
    expect(sourceLLM.getPaths()).toEqual([]);
  });

  it('should sync and generate content', async () => {
    const config = {
      format: SourceFormat.Llm,
      paths: [],
      prompt: 'Generate a book',
      model: 'test-model',
      mapper: (source: any) => [
        {
          orgId: 'test-org',
          pkgId: 'test-pkg',
          data: JSON.parse(source),
        },
      ],
    };

    const sourceLLM = new SourceLLM(config);
    await sourceLLM.sync();

    const items = sourceLLM.get();
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({
      orgId: 'test-org',
      pkgId: 'test-pkg',
      data: {
        title: 'Test Book',
        author: 'Test Author',
        description: 'A test book',
      },
    });
  });
});
