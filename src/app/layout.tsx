type TRootLayoutProps = {
  children: React.ReactNode;
};

async function RootLayout({ children }: TRootLayoutProps) {
  return <>{children}</>;
}

export default RootLayout;
