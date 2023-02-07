import { useRouter } from "next/router";
import React from "react";
import { ThreeColumnLayout } from "../../../../components";

const IssueDetailPage = () => {
  const router = useRouter();
  const query = router.query;
  const org = query.organization_id;
  const repo = query.repository_id;
  const issue = query.issue_id;
  return (
    <ThreeColumnLayout>
      <div className="col-span-12 lg:col-span-6 min-h-screen">
        <p>{org}</p>
        <p>{repo}</p>
        <p>{issue}</p>
      </div>
    </ThreeColumnLayout>
  );
};

export default IssueDetailPage;
