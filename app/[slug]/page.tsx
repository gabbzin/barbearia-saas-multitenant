export default async function Page(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;

  return <div>Tenant Page for {slug}</div>;
}
