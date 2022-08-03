import { useEffect } from 'react';
import supabaseClient from '../utils/supabase';

export async function getServerSideProps({ params }) {
  const { data: post, error } = await supabaseClient
    .from('posts')
    .select('*, comments(*)')
    .eq('id', params.id)
    .single();

  if (error) {
    throw new Error('Something went wrong while fetching this post', error);
  }

  return {
    props: {
      post
    }
  };
}

export default function Post({ post }) {
  useEffect(() => {
    const subscription = supabaseClient
      .from('comments')
      .on('INSERT', payload => {
        console.log(payload);
      })
      .subscribe();

    return () => supabaseClient.removeSubscription(subscription);
  }, []);
  return (
    <div>
      <pre>{JSON.stringify(post, null, 2)}</pre>
    </div>
  );
}
