import { cookies } from "next/headers";

export async function GET(request: Request) {
    const cookie = cookies();
    console.log(cookie.getAll());
    const user = JSON.stringify(cookie.get('user'));
    const userObj = JSON.parse(user);
    const mappedUser = {
        user: userObj.value
    }
    cookie.delete('user');
    return new Response(JSON.stringify(mappedUser) || '', { status: 200, headers: { 'Content-Type': 'application/json' } });
}