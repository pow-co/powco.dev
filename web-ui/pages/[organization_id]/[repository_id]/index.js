import { useRouter } from "next/router";
import React, { useState } from "react";
import { useOnchain } from "/hooks/useOnchain";
import Dashboard from "/components/Dashboard";
import ThreeColumnLayout from "../../../components/ThreeColumnLayout";
import GithubIssueCard from "../../../components/GithubIssueCard";
import { Loader } from "../../../components";
import { useTuning } from "../../../context/TuningContext";
import { useAPI } from "../../../hooks/useAPI";

const RepositoryPage = () => {
  const [tab, setTab] = useState("open");
  const router = useRouter();
  const query = router.query;
  console.log(query);
  const { startTimestamp } = useTuning();
  const org = query.organization_id;
  const repo = query.repository_id;
  let { data, error, loading } = useAPI(
    `/boostpow/rankings/github/issues/${org}/${repo}`,
    `?state=${tab}&start_date=${startTimestamp}`
  );

  let { issues } = data || [];

  return (
    <ThreeColumnLayout>
      <div className="col-span-12 lg:col-span-6 min-h-screen">
        <div className="px-4 mt-2">
          <div className="flex my-6">
            <div className="flex">
              <div
                //onClick={() => handleChangeTab("1F9E9")}
                onClick={() => setTab("open")}
                className={
                  //tag === "1F9E9"
                  tab === "open"
                    ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                    : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                }
              >
                Open
              </div>
              <div
                //onClick={() => handleChangeTab("1F4A1")}
                onClick={() => setTab("closed")}
                className={
                  //tag === "1F4A1"
                  tab === "closed"
                    ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                    : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                }
              >
                Closed
              </div>
            </div>
          </div>
        </div>
        <div className="w-full py-5">
          <div className="relative">
            {loading && <Loader />}
            {!error &&
              issues?.map((entry) => {
                if (entry) {
                  return <GithubIssueCard key={entry.txid} {...entry} />;
                }
              })}
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default RepositoryPage;
