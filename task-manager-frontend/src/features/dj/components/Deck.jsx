--- a/src/features/dj/components/Deck.jsx
+++ b/src/features/dj/components/Deck.jsx
@@
-  const ensureWave = () => {
+  /* WaveSurfer – 最初のレンダーで必ず作る */
+  const ensureWave = () => {
     if (waveRef.current || !waveDivRef.current) return;
@@
     waveRef.current.on("seek", (p) => {
-      const pl = playerRef.current;
-      if (pl) pl.seek(p);
+      const pl = playerRef.current;
+      if (pl?.seek) pl.seek(p); // ガード
     });
   };
 
   /* ファイル取り込み */
   const handleFile = useCallback(async (file) => {
     if (!file) return;
+    ensureWave();          // ★ 先に必ず呼ぶ
 
@@
     try {
       await axios.post(`${API_BASE_URL}/upload`, fd, {
@@
     } catch (e) {
       console.warn("Upload failed, continue local only", e);
+      setLoading(false);    // ★ 失敗時も UI 復帰
     }
@@
   const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
@@
-      <Box {...getRootProps()} sx={{ position: "relative", height: 100, mb: 2, bgcolor: "#f1f3f5" }}>
+      <Box {...getRootProps()} sx={{ position: "relative", minHeight: 120, mb: 2, bgcolor: "#f1f3f5" }}>
@@
-        {uploadPct !== null && (
+        {uploadPct !== null && (
           <LinearProgress variant="determinate" value={uploadPct} sx={{ position: "absolute", bottom: 0, width: "100%" }} />
         )}