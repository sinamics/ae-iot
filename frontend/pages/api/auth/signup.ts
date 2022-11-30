import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
  // console.log(user);
  const errors: [] = [];
  if (req.method !== 'POST') return;
  const { email, password } = JSON.parse(req.body);

  if (!email || !password)
    return res.status(400).send({ error: 'username or password is missing' });

  try {
    // username validation
    // if (validator.isEmpty(email)) {
    //   throw errors.push({ field: 'email', message: 'Must not be empty.' });
    // } else if (!validator.isLength(email, { max: 30 })) {
    //   throw errors.push({ field: 'email', message: 'Must be at a maximum 30 characters long.' });
    // } else if (!validator.isLength(email, { min: 3 })) {
    //   throw errors.push({ field: 'email', message: 'Must be at least 3 characters long.' });
    // }

    // password validation
    // if (validator.isEmpty(password)) {
    //   throw errors.push({ field: 'password', message: 'The password must not be empty.' });
    // } else if (!mediumPassword.test(password)) {
    //   throw errors.push({ field: 'password', message: 'Must include 6 char, with upper and lowercase' });
    // }
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(400).send({ error: `email "${email}" already taken` });
    }

    await db.user.create({
      data: { email, password: bcrypt.hashSync(password, 10) },
    });

    //@ts-ignore
    res.status(200).json({ email });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'something went wrong' });
  }
}
