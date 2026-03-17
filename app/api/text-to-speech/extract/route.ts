import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    if (fileName.endsWith('.txt')) {
      extractedText = fileBuffer.toString('utf-8');
    } else if (fileName.endsWith('.docx')) {
      try {
        const JSZip = await import('jszip');
        const zip = await JSZip.default.loadAsync(fileBuffer);
        const xmlContent = await zip.file('word/document.xml')?.async('text');
        
        if (xmlContent) {
          extractedText = xmlContent
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      } catch {
        return NextResponse.json(
          { error: 'Failed to parse DOCX file. Make sure it is a valid .docx file.' },
          { status: 400 }
        );
      }
    } else if (fileName.endsWith('.pdf')) {
      try {
        const textContent = fileBuffer.toString('utf-8');
        
        const textMatches = textContent.match(/\(([^)]*)\)[Tt]j/g);
        if (textMatches) {
          extractedText = textMatches
            .map(match => match.slice(1, -3))
            .join(' ')
            .replace(/\\\d{3}/g, (match) => String.fromCharCode(parseInt(match.slice(1), 8)))
            .replace(/\\\(/g, '(')
            .replace(/\\\)/g, ')')
            .replace(/\\\\/g, '\\')
            .trim();
        }

        if (!extractedText) {
          extractedText = textContent
            .replace(/[^\x20-\x7E\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0600-\u06FF]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 50000);
        }
      } catch {
        return NextResponse.json(
          { error: 'Failed to parse PDF file. Try copying and pasting the text directly.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please use .txt, .docx, or .pdf files.' },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the file. The file may be empty or corrupted.' },
        { status: 400 }
      );
    }

    const maxLength = 100000;
    if (extractedText.length > maxLength) {
      extractedText = extractedText.slice(0, maxLength) + '\n\n[Text truncated. Only first 100,000 characters processed.]';
    }

    return NextResponse.json({ 
      text: extractedText,
      originalFileName: file.name,
      characterCount: extractedText.length
    });

  } catch (error) {
    console.error('File extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to process file. Please try again.' },
      { status: 500 }
    );
  }
}
