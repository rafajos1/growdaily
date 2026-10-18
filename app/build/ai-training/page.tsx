import { ServicePageView, serviceMetadata, servicePage } from "../ServicePageView";

const page = servicePage("ai-training");
export const metadata = serviceMetadata(page);

export default function Page() {
  return <ServicePageView page={page} />;
}
