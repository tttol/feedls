import packageJson from "../../../package.json";

export default function AppVersion() {
  const getAppVersion = () => {
    return packageJson.version;
  };
  return (
    <div>
      <p className="text-right">version: {getAppVersion()}</p>
    </div>
  );
};