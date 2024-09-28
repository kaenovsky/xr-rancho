import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../utils/supabaseClient.js';

// Define the type that matches your 'releases' table structure
interface Release {
  id: string;
  version: string;
  description: string;
  download_link: string;
  created_at: string; // Optional if not always returned
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Fetch all releases
    const { data, error } = await supabase
      // @ts-ignore
      .from<Release>('releases')
      .select('*');

    if (error) {
      console.error('GET Error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    console.log('POST Request Body:', req.body);
    const { version, description, download_link } = req.body;

    console.log('Extracted Data:', { version, description, download_link });

    // Insert the new release
    const { data: insertedData, error: insertError } = await supabase
      // @ts-ignore
      .from<Release>('releases')
      .insert([{ version, description, download_link }])
      .select('*'); // This will return the inserted row

    // Check for errors during insertion
    if (insertError) {
      console.error('POST Insert Error:', insertError.message);
      return res.status(500).json({ error: insertError.message });
    }

    // Return the inserted data
    console.log('POST Success:', insertedData);
    return res.status(201).json(insertedData);
  }

  // If the request method is not supported
  res.status(405).json({ error: 'Method not allowed' });
}
