import type { Schema } from "@/../amplify/data/resource";
import outputs from "../../../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";

Amplify.configure(outputs);
export const generateAmplifyClient = () => {
    return generateClient<Schema>();
}