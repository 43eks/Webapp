import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

export default function DJLanding() {
  return (
    <Box textAlign="center" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎧 DJ モード
      </Typography>
      <Typography mb={2}>
        2Deck ミキサーで友達と気軽に遊ぼう！
      </Typography>
      <Button variant="contained" component={Link} to="/dj/studio">
        スタジオへ
      </Button>
    </Box>
  );
}