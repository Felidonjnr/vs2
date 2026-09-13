import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co';
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZGVscXRkZm1qbnpsd3p5bHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNzgwMjMsImV4cCI6MjEwNDg1NDAyM30.mX3TsDOOD30oWaVczgzmraft3CNGASsJdarCVntWSBs';

export const supabase = createClient(supabaseUrl, supabaseKey);

export enum OperationType {
  GET = 'GET',
  WRITE = 'WRITE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export const handleSupabaseError = (error: any, type: OperationType, context: string) => {
  console.error(`Supabase ${type} Error at [${context}]:`, error);
};
