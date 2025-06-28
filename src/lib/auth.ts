import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: { name?: string; avatar_url?: string }) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createUserProfile(userId: string, name: string, avatarUrl?: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert([
      {
        user_id: userId,
        name,
        avatar_url: avatarUrl || null,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreateUserProfile(userId: string, name: string, avatarUrl?: string) {
  try {
    // First try to get existing profile
    const { data: existingProfile, error: getError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!getError && existingProfile) {
      // Profile exists, return it
      return existingProfile;
    }

    // Profile doesn't exist, create it
    console.log(`Creating profile for user ${userId} with name: ${name}`);
    const { data: newProfile, error: createError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          user_id: userId,
          name,
          avatar_url: avatarUrl || null,
        }
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creating profile:', createError);
      throw createError;
    }

    console.log(`Successfully created profile for user ${userId}`);
    return newProfile;
  } catch (error) {
    console.error('Error in getOrCreateUserProfile:', error);
    throw error;
  }
}
