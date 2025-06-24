import React from 'react';
import { Typography, Box } from '@mui/material';

export default function DJStudio() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        DJ Studio (Coming Soon)
      </Typography>
      {/* ← ここに Deck / Mixer / MIDI Learn 等を今後配置 */}
    </Box>
  );
}