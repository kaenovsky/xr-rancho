import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../utils/supabaseClient.js';

// Define the type that matches your `releases` table structure
interface Release {
  id: number;
  version: string;
  description: string;
  download_link: string;
  created_at: string; // Optional if not always returned
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from<Release>('releases').select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Return the data as an array
    return res.status(200).json(data);
  }

  // Handle other methods if needed
  res.status(405).json({ error: 'Method not allowed' });
}
