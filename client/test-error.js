const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('posts').insert({
    title: 'Test',
    body: 'Test body',
    image_url: null,
    author_id: '4ca34da5-13b0-4980-9f26-90836e9a465e',
    summary: 'Test summary'
  }).select('id').single();
  console.log('Result:', { data, error });
}
test();
