import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth-config"
import { generateToken } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // The user object from the session might have a different shape
  // depending on the provider. We need to ensure we have the id, email, and name.
  const user = session.user as { id: string; email: string; name: string }

  const userPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
  }

  // Generate your custom JWT
  const token = generateToken(userPayload)

  return NextResponse.json({
    user: userPayload,
    token: token,
  })
}
