#!/bin/bash
set -e

echo "Installing yt-dlp..."
pip3 install yt-dlp 2>/dev/null || pip install yt-dlp 2>/dev/null || echo "yt-dlp install skipped"

echo "Installing ffmpeg..."
which ffmpeg || apt-get install -y -qq ffmpeg 2>/dev/null || echo "ffmpeg install skipped"

echo "Installing Node dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Build complete."
