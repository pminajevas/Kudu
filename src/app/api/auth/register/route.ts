import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateToken, createUserProfile } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received');
    const { email, password, name } = await request.json();
    console.log('Request data:', { email, name, passwordLength: password?.length });

    if (!email || !password || !name) {
      console.log('Validation failed: missing fields');
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

   
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, 
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      console.error('No user data returned from Supabase');
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
;
    const profile = await createUserProfile(authData.user.id, name);

    const userPayload = {
      id: authData.user.id,
      email: authData.user.email!,
      name,
    };

    const token = generateToken(userPayload);

    return NextResponse.json({
      message: 'Registration successful',
      user: userPayload,
      token,
      profile
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
