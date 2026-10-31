import { ServicePageView, serviceMetadata, servicePage } from "../ServicePageView";

const page = servicePage("ai-governance");
export const metadata = serviceMetadata(page);

export default function Page() {
  return <ServicePageView page={page} />;
}
