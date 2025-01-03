import { Box, Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import type { NextPage } from 'next';
import Link from 'next/link';

type FormValues = {
  email: string;
  password: string;
};

const SignUp: NextPage = () => {
  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => {
        return /^\S+@\S+$/.test(value) ? null : 'Invalid email';
      },
    },
  });

  const handleSignup = async ({ email, password }: FormValues): Promise<void> => {
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;
      const response = await axios.post<{ uid: string }>('/api/setCustomClaim', {
        uid,
      });
      console.log({ response });
      console.log('signed up');
    } catch (error) {
      console.log(error);
      throw new Error("Couldn't sign up");
    }
  };

  return (
    <Box maw={300} mx='auto'>
      <form
        onSubmit={form.onSubmit((values) => {
          return handleSignup(values);
        })}
      >
        <TextInput withAsterisk label='Email' placeholder='your@email.com' {...form.getInputProps('email')} />
        <TextInput
          withAsterisk
          label='Password'
          placeholder='your password'
          type='password'
          {...form.getInputProps('password')}
        />

        <Group position='right' mt='md'>
          <Button type='submit' data-testid='submitButton'>
            Submit
          </Button>
        </Group>
      </form>
      <Link href='sign-in'>signIn</Link>
    </Box>
  );
};

export default SignUp;
