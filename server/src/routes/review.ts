import { Router, Request, Response } from 'express';
import { analyzeCode, streamAnalyzeCode } from '../services/ai.js';
import { v4 as uuidv4 } from 'uuid';

export const reviewRouter = Router();

// Analyze code - returns full analysis
reviewRouter.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { code, language, filename } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    console.log(`[${new Date().toISOString()}] Analyzing code (${language || 'unknown'}) - ${filename || 'unnamed'}`);

    const analysis = await analyzeCode(code, language, filename);

    res.json({
      id: uuidv4(),
      filename: filename || 'code',
      language: language || 'unknown',
      timestamp: new Date().toISOString(),
      analysis
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze code',
      message: error.message
    });
  }
});

// Stream analysis - for real-time feedback
reviewRouter.post('/stream', async (req: Request, res: Response) => {
  try {
    const { code, language, filename } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log(`[${new Date().toISOString()}] Streaming analysis (${language || 'unknown'})`);

    await streamAnalyzeCode(code, language, filename, (chunk: string) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Stream error:', error);
    res.status(500).json({ error: 'Failed to stream analysis', message: error.message });
  }
});

// Batch analyze multiple files
reviewRouter.post('/batch', async (req: Request, res: Response) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'Files array is required' });
    }

    console.log(`[${new Date().toISOString()}] Batch analyzing ${files.length} files`);

    const results = await Promise.all(
      files.map(async (file: any) => {
        try {
          const analysis = await analyzeCode(file.code, file.language, file.filename);
          return {
            id: uuidv4(),
            filename: file.filename || 'code',
            language: file.language || 'unknown',
            timestamp: new Date().toISOString(),
            analysis,
            success: true
          };
        } catch (error: any) {
          return {
            filename: file.filename || 'code',
            error: error.message,
            success: false
          };
        }
      })
    );

    res.json({ results });
  } catch (error: any) {
    console.error('Batch error:', error);
    res.status(500).json({ error: 'Failed batch analysis', message: error.message });
  }
});
