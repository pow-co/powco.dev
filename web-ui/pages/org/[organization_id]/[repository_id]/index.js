import { useRouter } from "next/router";
import React from "react";
import { useOnchain } from "/hooks/useOnchain";
import Dashboard from "/components/Dashboard";
import { useTuning } from "../../../../context/TuningContext";
const RepositoryPage = () => {
  const router = useRouter();
  const query = router.query;
  console.log(query);
  const { startTimestamp } = useTuning();
  let {
    data: events,
    error: error_events,
    refresh,
    loading: loading_events,
  } = useOnchain(`/events`); //, `start_date=${startTimestamp}`); // , `?limit=21`
  //let { data: recent } = useAPI("/recent/questions?limit=100");
  let {
    data: rankings,
    error: error_rankings,
    loading: loading_rankings,
  } = useOnchain("/boostpow/rankings", `start_date=${startTimestamp}`);

  let boosted = rankings?.rankings.map((issue) => {
    console.log(issue);
    if (
      issue.content.organization.login === query.organization_id &&
      issue.content.repository.name === query.repository_id
    ) {
      return issue;
    }
  });
  let boosted_tx = boosted?.map((e) => {
    return e?.txid;
  });
  let unboosted = events?.events.map((issue) => {
    if (
      issue.content.action === "opened" &&
      issue.content.organization.login === query.organization_id &&
      issue.content.repository.name === query.repository_id
    ) {
      return issue;
    }
  });

  unboosted = unboosted?.filter((issue) => !boosted_tx?.includes(issue?.txid));

  let issues;
  if (boosted && unboosted) {
    issues = [...boosted, ...unboosted];
  }
  return (
    <Dashboard
      data={issues}
      error={error_events || error_rankings}
      loading={loading_events || loading_rankings}
    />
  );
};

export default RepositoryPage;
