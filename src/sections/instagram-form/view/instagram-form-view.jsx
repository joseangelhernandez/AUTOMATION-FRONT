import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { InstagramAccountsQty } from 'src/services/ig-automation/ig-automation-service-calls';

import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';

import InstagramForm from '../instagram-form';

// ----------------------------------------------------------------------

export default function InstagramFormView() {
  const settings = useSettingsContext();
  const [loading, setLoading] = useState(true);
  const [accountsQty, setAccountsQty] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const response = await InstagramAccountsQty();

      if (response.status === 200) {
        setAccountsQty(response.data);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4" mb={5}>
        {' '}
        Instagram Form Automation{' '}
      </Typography>

      <InstagramForm AccountsQty={accountsQty} />
    </Container>
  );
}
