import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            login(email: "${email}", password: "${password}") {
              accessToken
            }
          }
        `,
      }),
    });

    const data = await response.json();
    if (data.data?.login?.accessToken) {
      res.status(200).json({ token: data.data.login.accessToken });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
