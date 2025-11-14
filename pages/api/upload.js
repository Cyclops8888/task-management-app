import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const boundary = contentType.split('boundary=')[1];
    const parts = buffer.toString('binary').split(`--${boundary}`);
    
    let fileData = null;
    let fileName = null;

    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data; name="file"')) {
        const fileNameMatch = part.match(/filename="(.+?)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
        
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd !== -1) {
          const binaryPart = part.substring(headerEnd + 4);
          const endMarker = binaryPart.lastIndexOf('\r\n');
          const binaryData = binaryPart.substring(0, endMarker);
          fileData = Buffer.from(binaryData, 'binary');
        }
        break;
      }
    }

    if (!fileData || !fileName) {
      return res.status(400).json({ error: 'ファイルがありません' });
    }

    if (!fileName.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'PDFファイルのみアップロード可能です' });
    }

    const blob = await put(fileName, fileData, {
      access: 'public',
      contentType: 'application/pdf',
    });

    return res.status(200).json({
      url: blob.url,
      fileName: fileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'アップロードに失敗しました' });
  }
}
