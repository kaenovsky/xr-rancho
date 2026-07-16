// File: pages/api/releases/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../../utils/supabaseClient.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabase) {
    return res.status(503).json({ error: 'Supabase is not configured or unavailable' });
  }

  const { id } = req.query;

  try {
    if (req.method === 'DELETE') {
      // Delete the release with the specified id
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('DELETE Error:', error.message);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Release deleted successfully' });
    }

    if (req.method === 'PUT') {
      const { version, description, download_link } = req.body;

      // Update the release with the specified id
      const { error } = await supabase
        .from('releases')
        .update({ version, description, download_link })
        .eq('id', id);

      if (error) {
        console.error('PUT Error:', error.message);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Release updated successfully' });
    }

    // If the request method is not DELETE or PUT
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    // Catches network-level failures (e.g. Supabase project paused/unreachable)
    // that aren't surfaced through the normal { error } response shape.
    console.error('Unexpected Supabase error:', err);
    return res.status(503).json({ error: 'Supabase is currently unavailable' });
  }
}
