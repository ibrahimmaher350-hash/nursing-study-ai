// ==============================================================================
// NURSING STUDY AI — PPTX SLIDE PARSER
// مستخرج نصوص وعناصر شرائح الباوربوينت (.pptx) عبر XML
// ==============================================================================

import JSZip from 'jszip';
import { Slide, TableBlock, TableRow } from '@/types';
import { formatSlideId } from '@/lib/utils';

export interface ExtractedSlideRaw {
  slideNumber: number;
  title: string;
  textBlocks: string[];
  tables: TableBlock[];
  rawText: string;
}

export async function parsePptxBuffer(buffer: ArrayBuffer): Promise<ExtractedSlideRaw[]> {
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles: { path: string; number: number }[] = [];

  // Match ppt/slides/slide{N}.xml
  zip.forEach((relativePath) => {
    const match = relativePath.match(/^ppt\/slides\/slide(\d+)\.xml$/i);
    if (match) {
      slideFiles.push({
        path: relativePath,
        number: parseInt(match[1], 10),
      });
    }
  });

  // Sort slides numerically
  slideFiles.sort((a, b) => a.number - b.number);

  const extractedSlides: ExtractedSlideRaw[] = [];

  for (const slideInfo of slideFiles) {
    const xmlContent = await zip.file(slideInfo.path)?.async('text');
    if (!xmlContent) continue;

    const extracted = parseSlideXml(xmlContent, slideInfo.number);
    extractedSlides.push(extracted);
  }

  return extractedSlides;
}

function parseSlideXml(xml: string, slideNumber: number): ExtractedSlideRaw {
  const textBlocks: string[] = [];
  const tables: TableBlock[] = [];

  // Extract paragraphs <a:p>...</a:p>
  const paragraphRegex = /<a:p\b[^>]*>([\s\S]*?)<\/a:p>/gi;
  let pMatch: RegExpExecArray | null;

  while ((pMatch = paragraphRegex.exec(xml)) !== null) {
    const pContent = pMatch[1];
    // Extract text runs <a:t>...</a:t>
    const tRegex = /<a:t\b[^>]*>([\s\S]*?)<\/a:t>/gi;
    let tMatch: RegExpExecArray | null;
    let paragraphText = '';

    while ((tMatch = tRegex.exec(pContent)) !== null) {
      paragraphText += decodeXmlEntities(tMatch[1]);
    }

    paragraphText = paragraphText.trim();
    if (paragraphText.length > 0) {
      textBlocks.push(paragraphText);
    }
  }

  // Extract tables <a:tbl>...</a:tbl>
  const tableRegex = /<a:tbl\b[^>]*>([\s\S]*?)<\/a:tbl>/gi;
  let tblMatch: RegExpExecArray | null;

  while ((tblMatch = tableRegex.exec(xml)) !== null) {
    const tblXml = tblMatch[1];
    const rows: TableRow[] = [];
    const trRegex = /<a:tr\b[^>]*>([\s\S]*?)<\/a:tr>/gi;
    let trMatch: RegExpExecArray | null;

    while ((trMatch = trRegex.exec(tblXml)) !== null) {
      const trXml = trMatch[1];
      const cells: string[] = [];
      const tcRegex = /<a:tc\b[^>]*>([\s\S]*?)<\/a:tc>/gi;
      let tcMatch: RegExpExecArray | null;

      while ((tcMatch = tcRegex.exec(trXml)) !== null) {
        const tcXml = tcMatch[1];
        const tRegex = /<a:t\b[^>]*>([\s\S]*?)<\/a:t>/gi;
        let tMatch: RegExpExecArray | null;
        let cellText = '';
        while ((tMatch = tRegex.exec(tcXml)) !== null) {
          cellText += decodeXmlEntities(tMatch[1]);
        }
        cells.push(cellText.trim());
      }
      if (cells.length > 0) {
        rows.push({ cells });
      }
    }

    if (rows.length > 0) {
      const headers = rows[0].cells;
      const bodyRows = rows.slice(1);
      tables.push({ headers, rows: bodyRows });
    }
  }

  // Derive title: usually the first short line, or "Slide N"
  const title = textBlocks.length > 0 ? textBlocks[0] : `Slide ${slideNumber}`;
  const rawText = textBlocks.join('\n');

  return {
    slideNumber,
    title,
    textBlocks,
    tables,
    rawText,
  };
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
