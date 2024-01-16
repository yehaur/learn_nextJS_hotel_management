import { signUpHandler } from "next-auth-sanity";
import sanityClient from "@/src/libs/sanity";
import { SanityClient } from "sanity";

export const POST = signUpHandler(sanityClient: SanityClient);