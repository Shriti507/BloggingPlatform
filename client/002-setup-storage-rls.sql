-- Allow public read access to the images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow authenticated users to upload new files
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- Allow users to update their own files
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' AND auth.uid() = owner )
WITH CHECK ( bucket_id = 'images' AND auth.uid() = owner );

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' AND auth.uid() = owner );
