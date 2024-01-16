import { SanityClient, createClient } from "next-sanity";

const sanityClient: SanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_STUDIO_TOKEN as string,
    apiVersion: '2024-01-16',
});

export default (sanityClient: SanityClient);