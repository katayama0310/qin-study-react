// admin顕現の人しか見れない画面
import { Button } from '@mantine/core';
import axios from 'axios';
import { addDoc, collection } from 'firebase/firestore';
import { useAtom } from 'jotai';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { db } from '../../libs/firebase';
import { userAtom } from '../../state/user.state';
import { DefaultTemplate } from '../../templates/defaultTemplate';

const Admin: NextPage = () => {
  const [user, _] = useAtom(userAtom);
  // admin権限があるかどうかを確認する
  // なければリダイレクト
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      if (!user) return;
      await user.getIdToken(true);
      await user.reload();
      const idTokenResult = await user.getIdTokenResult();
      setIsAdmin(!!idTokenResult.claims.admin);
    })();
  }, []);

  // mycollecttionというコレクションに書き込み
  const handleWrite = async () => {
    const docRef = await addDoc(collection(db, 'myCollection'), {
      country: 'Japan',
      name: 'Tokyo',
    });
    console.log('Document written with ID: ', docRef.id);
  };

  const handleCheckCustomClaims = async () => {
    if (!user) return;
    // 伝搬
    await user.getIdToken(true);
    await user.reload();
    const idTokenResult = await user.getIdTokenResult();
    console.log(idTokenResult.claims);
  };

  const handleSetCustomClaim = async () => {
    const uid = user?.uid;
    console.log(uid);
    const response = await axios.post<{ uid: string }>('/api/setCustomClaim', {
      uid,
    });
    console.log(response);
  };

  const turnToPremiun = async () => {
    const uid = user?.uid;
    console.log(uid);
    const response = await axios.post<{ uid: string }>('/api/setCustomClaim', {
      kind: 'Premium',
      uid,
    });
    console.log(response);
  };

  return (
    <DefaultTemplate>
      {isAdmin ? (
        <>
          <h1>admin</h1>
        </>
      ) : (
        <>
          <h1>no admin</h1>
          <Button onClick={handleSetCustomClaim}>set custom claims</Button>
        </>
      )}
      <Button onClick={turnToPremiun}>turn to Premiun</Button>
      <Button onClick={handleCheckCustomClaims}>check custom claims</Button>
      <Button onClick={handleWrite}>add</Button>
      <Link href='/'>home</Link>
    </DefaultTemplate>
  );
};

export default Admin;
