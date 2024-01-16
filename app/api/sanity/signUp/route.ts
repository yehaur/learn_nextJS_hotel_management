import { signUpHandler } from "next-auth-sanity";
import sanityClient from "@/src/libs/sanity";

export const POST = signUpHandler(sanityClient);