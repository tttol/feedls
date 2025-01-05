import React from "react";

export default function AppVersion() {
  const getAppVersion = () => {
    const packageJson = require("../../../package.json");
    return packageJson.version;
  };
  return (
    <div>
      <p className="text-right">version: {getAppVersion()}</p>
    </div>
  );
};