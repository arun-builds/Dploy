import WebsitePage from "@/components/WebsitePage";
import { prisma, Website } from "@repo/database";

export default async function Page({
    params,
  }: {
    params: Promise<{ domainId: string }>
  }) {
    const { domainId } = await params
    const website = await prisma.website.findUnique({
        where: {
            domainId: domainId
        }
    })
    if (!website) {
        return <div>Website not found</div>
    }
      return <WebsitePage website={website as Website} />
  }

