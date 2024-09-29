// File: src/pages/api/releases.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../../utils/supabaseClient.js';

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
      // @ts-expect-error - Supabase query method expects two type parameters, but we only provide one to match the Release schema
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
      // @ts-expect-error - Supabase query method expects two type parameters, but we only provide one to match the Release schema
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

  if (req.method === 'PUT') {
    const { id, version, description, download_link } = req.body;

    // Update the existing release
    const { data: updatedData, error: updateError } = await supabase
      // @ts-expect-error - Supabase query method expects two type parameters, but we only provide one to match the Release schema
      .from<Release>('releases')
      .update({ version, description, download_link })
      .eq('id', id)
      .select('*');

    // Check for errors during update
    if (updateError) {
      console.error('PUT Update Error:', updateError.message);
      return res.status(500).json({ error: updateError.message });
    }

    // Ensure updatedData is not null before returning
    if (!updatedData || updatedData.length === 0) {
      console.error('PUT Error: No data returned');
      return res.status(404).json({ error: 'No data found' });
    }

    // Return the updated release
    console.log('PUT Success:', updatedData);
    return res.status(200).json(updatedData[0]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;

    const { error: deleteError } = await supabase
      // @ts-expect-error - Supabase query method expects two type parameters, but we only provide one to match the Release schema
      .from<Release>('releases')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('DELETE Error:', deleteError.message);
      return res.status(500).json({ error: deleteError.message });
    }

    return res.status(204).end();
  }

  // If the request method is not supported
  res.status(405).json({ error: 'Method not allowed' });
}
