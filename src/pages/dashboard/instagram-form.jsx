import { Helmet } from 'react-helmet-async';

import InstagramForm from 'src/sections/instagram-form/view/instagram-form-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Automation: Instagram</title>
      </Helmet>

      <InstagramForm />
    </>
  );
}
