import * as Layout from '@/app/ui/Layout';
import { ClientRootLayout } from '../_components/ClientRootLayout';
import { LayoutHeader } from '../_components/LayoutHeader';
import { LayoutNavigation } from '../_components/LayoutNavigation';
import { SurveyIdsContextProvider } from '../_components/SurveyViewNavigator/provider';

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function SiteLayout({ children, modal }: Props) {
  return (
    <SurveyIdsContextProvider>
      <ClientRootLayout>
        <LayoutHeader />
        <Layout.Container>
          <LayoutNavigation/>
            <Layout.Main>
              {children}
              {modal}
            </Layout.Main>
          </Layout.Container>
        <Layout.Footer />
      </ClientRootLayout>
    </SurveyIdsContextProvider>
  );
}