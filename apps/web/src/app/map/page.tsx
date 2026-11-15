import { BranchGraph } from "@/components/map/branch-graph";
import { Button } from "@/components/ui/button";
import { MockNotice, PageHeader } from "@/components/ui/page-header";
import Link from "next/link";

export default function MapPage() {
  return (
    <div>
      <PageHeader
        title="Story map"
        description="Every branch of your story. Nodes are coloured by continuity score."
        actions={
          <Button asChild variant="outline">
            <Link href="/whatif">Compare branches</Link>
          </Button>
        }
      />
      <MockNotice />
      <BranchGraph />
    </div>
  );
}
